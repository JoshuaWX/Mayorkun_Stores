const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { createConnection } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', authenticateToken, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product_name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('delivery_address').trim().isLength({ min: 10 }).withMessage('Delivery address is required'),
  body('payment_method').isIn(['card', 'bank_transfer', 'mobile_money', 'cash']).withMessage('Invalid payment method')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    items,
    delivery_address,
    special_instructions,
    payment_method
  } = req.body;

  const db = createConnection();
  
  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Generate order number
    const orderNumber = `MKN-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Calculate totals
    let totalAmount = 0;
    const deliveryFee = 1500; // Fixed delivery fee
    
    // For now, we'll use custom pricing since we don't have product IDs
    // In a real scenario, you'd look up products by ID
    items.forEach(item => {
      const estimatedPrice = 5000; // Default price for custom orders
      item.unit_price = estimatedPrice;
      item.total_price = estimatedPrice * item.quantity;
      totalAmount += item.total_price;
    });

    // Get user's member discount
    db.get('SELECT member_discount FROM users WHERE id = ?', [req.user.userId], (err, user) => {
      if (err) {
        db.run('ROLLBACK');
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      const discountAmount = totalAmount * (user?.member_discount || 0);
      const finalAmount = totalAmount - discountAmount + deliveryFee;

      // Insert order
      const orderStmt = db.prepare(`
        INSERT INTO orders (
          user_id, order_number, total_amount, discount_amount, 
          delivery_fee, final_amount, delivery_address, 
          special_instructions, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      orderStmt.run([
        req.user.userId,
        orderNumber,
        totalAmount,
        discountAmount,
        deliveryFee,
        finalAmount,
        delivery_address,
        special_instructions || null,
        payment_method
      ], function(err) {
        if (err) {
          db.run('ROLLBACK');
          db.close();
          return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: err.message
          });
        }

        const orderId = this.lastID;

        // Insert order items
        const itemStmt = db.prepare(`
          INSERT INTO order_items (
            order_id, product_name, quantity, unit_price, total_price
          ) VALUES (?, ?, ?, ?, ?)
        `);

        let itemsInserted = 0;
        let hasError = false;

        items.forEach(item => {
          itemStmt.run([
            orderId,
            item.product_name,
            item.quantity,
            item.unit_price,
            item.total_price
          ], (err) => {
            if (err && !hasError) {
              hasError = true;
              db.run('ROLLBACK');
              db.close();
              return res.status(500).json({
                success: false,
                message: 'Failed to add order items',
                error: err.message
              });
            }

            itemsInserted++;
            
            if (itemsInserted === items.length && !hasError) {
              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  db.close();
                  return res.status(500).json({
                    success: false,
                    message: 'Failed to commit order',
                    error: err.message
                  });
                }

                itemStmt.finalize();
                orderStmt.finalize();
                db.close();

                res.status(201).json({
                  success: true,
                  message: 'Order created successfully',
                  data: {
                    orderId,
                    orderNumber,
                    totalAmount,
                    discountAmount,
                    deliveryFee,
                    finalAmount,
                    status: 'pending',
                    itemCount: items.length
                  }
                });
              });
            }
          });
        });
      });
    });
  });
});

// Get user's orders
router.get('/my-orders', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const db = createConnection();
  
  db.all(`
    SELECT o.*, 
           COUNT(oi.id) as item_count,
           GROUP_CONCAT(oi.product_name || ' (x' || oi.quantity || ')') as items_summary
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `, [req.user.userId, parseInt(limit), parseInt(offset)], (err, orders) => {
    if (err) {
      db.close();
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [req.user.userId], (err, countResult) => {
      db.close();
      
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Get specific order
router.get('/:orderId', authenticateToken, (req, res) => {
  const db = createConnection();
  
  // Get order details
  db.get(`
    SELECT * FROM orders WHERE id = ? AND user_id = ?
  `, [req.params.orderId, req.user.userId], (err, order) => {
    if (err) {
      db.close();
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (!order) {
      db.close();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order items
    db.all(`
      SELECT * FROM order_items WHERE order_id = ?
    `, [req.params.orderId], (err, items) => {
      if (err) {
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      // Get payment transactions
      db.all(`
        SELECT * FROM payment_transactions WHERE order_id = ?
      `, [req.params.orderId], (err, transactions) => {
        db.close();
        
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        res.json({
          success: true,
          data: {
            ...order,
            items,
            transactions
          }
        });
      });
    });
  });
});

// Update order status (for admin use, but keeping simple for now)
router.patch('/:orderId/status', authenticateToken, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { status } = req.body;
  const db = createConnection();

  db.run(`
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND user_id = ?
  `, [status, req.params.orderId, req.user.userId], function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  });
});

module.exports = router;
