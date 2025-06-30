const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createConnection } = require('../database/init');

const router = express.Router();

// Register new user
router.post('/register', [
  body('full_name').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9]{11}$/).withMessage('Phone number must be 11 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('date_of_birth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Please select a valid gender'),
  body('state').trim().isLength({ min: 2 }).withMessage('Please select your state'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      full_name,
      email,
      phone,
      password,
      date_of_birth,
      gender,
      marital_status,
      state,
      address,
      age
    } = req.body;

    const db = createConnection();

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (row) {
        db.close();
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const stmt = db.prepare(`
        INSERT INTO users (
          full_name, email, phone, password_hash, date_of_birth,
          gender, marital_status, state, address, age, is_member, member_discount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        full_name,
        email,
        phone,
        password_hash,
        date_of_birth,
        gender,
        marital_status || null,
        state,
        address,
        age,
        1, // is_member
        0.23 // member_discount (23%)
      ], function(err) {
        if (err) {
          db.close();
          return res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: err.message
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: this.lastID,
            email: email,
            isMember: true
          },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        stmt.finalize();
        db.close();

        res.status(201).json({
          success: true,
          message: 'Registration successful! Welcome to Mayokun Stores family.',
          data: {
            userId: this.lastID,
            full_name,
            email,
            phone,
            is_member: true,
            member_discount: 0.23,
            token
          }
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const db = createConnection();

    db.get(`
      SELECT id, full_name, email, phone, password_hash, is_member, member_discount, is_active
      FROM users WHERE email = ?
    `, [email], async (err, user) => {
      if (err) {
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!user) {
        db.close();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      if (!user.is_active) {
        db.close();
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        db.close();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          isMember: user.is_member
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      db.close();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          userId: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          is_member: user.is_member,
          member_discount: user.member_discount,
          token
        }
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const db = createConnection();
    db.get('SELECT id, full_name, email, is_member FROM users WHERE id = ? AND is_active = 1', [decoded.userId], (err, user) => {
      db.close();
      
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          userId: user.id,
          full_name: user.full_name,
          email: user.email,
          is_member: user.is_member
        }
      });
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

module.exports = router;
