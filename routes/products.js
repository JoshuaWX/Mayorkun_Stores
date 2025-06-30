const express = require('express');
const { body, validationResult } = require('express-validator');
const { createConnection } = require('../database/init');

const router = express.Router();

// Get all products with optional filtering
router.get('/', (req, res) => {
  const { category, featured, search, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM products WHERE is_active = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (featured === 'true') {
    query += ' AND is_featured = 1';
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const db = createConnection();
  db.all(query, params, (err, products) => {
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
      data: products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const db = createConnection();
  
  db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [req.params.id], (err, product) => {
    db.close();
    
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  });
});

// Get product categories
router.get('/categories/list', (req, res) => {
  const db = createConnection();
  
  db.all(`
    SELECT DISTINCT category, COUNT(*) as product_count 
    FROM products 
    WHERE is_active = 1 
    GROUP BY category
    ORDER BY category
  `, (err, categories) => {
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
      data: categories
    });
  });
});

// Search products
router.get('/search/:term', (req, res) => {
  const searchTerm = `%${req.params.term}%`;
  const db = createConnection();
  
  db.all(`
    SELECT * FROM products 
    WHERE is_active = 1 
    AND (name LIKE ? OR description LIKE ? OR category LIKE ?)
    ORDER BY 
      CASE 
        WHEN name LIKE ? THEN 1
        WHEN description LIKE ? THEN 2
        ELSE 3
      END,
      name ASC
    LIMIT 20
  `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, products) => {
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
      data: products,
      searchTerm: req.params.term
    });
  });
});

module.exports = router;
