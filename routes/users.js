const express = require('express');
const { body, validationResult } = require('express-validator');
const { createConnection } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const db = createConnection();
  
  db.get(`
    SELECT id, full_name, email, phone, date_of_birth, gender, 
           marital_status, state, address, age, is_member, member_discount,
           created_at, updated_at
    FROM users WHERE id = ?
  `, [req.user.userId], (err, user) => {
    db.close();
    
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  });
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('full_name').optional().trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('phone').optional().matches(/^[0-9]{11}$/).withMessage('Phone number must be 11 digits'),
  body('address').optional().trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('state').optional().trim().isLength({ min: 2 }).withMessage('Please select your state')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const allowedFields = ['full_name', 'phone', 'address', 'state', 'marital_status'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields to update'
    });
  }

  const db = createConnection();
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), new Date().toISOString(), req.user.userId];

  db.run(`
    UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?
  `, values, function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  });
});

// Get user orders
router.get('/orders', authenticateToken, (req, res) => {
  const db = createConnection();
  
  db.all(`
    SELECT o.*, 
           GROUP_CONCAT(oi.product_name || ' (x' || oi.quantity || ')') as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.user.userId], (err, orders) => {
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
      data: orders
    });
  });
});

// Get specific order details
router.get('/orders/:orderId', authenticateToken, (req, res) => {
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
          items
        }
      });
    });
  });
});

module.exports = router;
