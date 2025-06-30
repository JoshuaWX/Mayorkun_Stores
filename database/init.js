const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || './database/mayokun_stores.db';

// Create database connection
function createConnection() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });
}

// Initialize database with tables
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Create tables
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          date_of_birth DATE,
          gender TEXT CHECK(gender IN ('male', 'female', 'other')),
          marital_status TEXT CHECK(marital_status IN ('single', 'married', 'divorced', 'widowed')),
          state TEXT NOT NULL,
          address TEXT NOT NULL,
          age INTEGER,
          is_member BOOLEAN DEFAULT 1,
          member_discount REAL DEFAULT 0.23,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )
      `);

      // Admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'super_admin')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME,
          is_active BOOLEAN DEFAULT 1
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          stock_quantity INTEGER DEFAULT 0,
          image_url TEXT,
          is_featured BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          order_number TEXT UNIQUE NOT NULL,
          total_amount REAL NOT NULL,
          discount_amount REAL DEFAULT 0,
          delivery_fee REAL DEFAULT 1500,
          final_amount REAL NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
          payment_method TEXT CHECK(payment_method IN ('card', 'bank_transfer', 'mobile_money', 'cash')),
          payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
          delivery_address TEXT,
          special_instructions TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER,
          product_name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price REAL NOT NULL,
          total_price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Contact messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'closed')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Payment transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          transaction_reference TEXT,
          payment_method TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed', 'cancelled')),
          payment_data TEXT, -- JSON string for additional payment info
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id)
        )
      `);

      // Insert sample data
      insertSampleData(db);
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        reject(err);
      } else {
        console.log('Database initialization completed');
        resolve();
      }
    });
  });
}

// Insert sample data
function insertSampleData(db) {
  // Insert sample admin user
  const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
  db.run(`
    INSERT OR IGNORE INTO admin_users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `, ['admin', process.env.ADMIN_EMAIL || 'admin@mayokun.com', adminPassword, 'super_admin']);

  // Insert sample products
  const sampleProducts = [
    {
      name: 'Oriflame Wonder Colour Lipstick',
      description: 'Premium Swedish lipstick with long-lasting formula',
      category: 'cosmetics',
      price: 2500,
      stock_quantity: 50,
      image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 1
    },
    {
      name: 'Household Cleaning Kit',
      description: 'Complete cleaning supplies for your home',
      category: 'household',
      price: 3500,
      stock_quantity: 30,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 1
    },
    {
      name: 'Premium Rice (50kg)',
      description: 'High quality rice for your family',
      category: 'food',
      price: 45000,
      stock_quantity: 20,
      image_url: 'https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 0
    },
    {
      name: 'Fashion Handbag',
      description: 'Stylish and durable handbag for everyday use',
      category: 'fashion',
      price: 8500,
      stock_quantity: 15,
      image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 1
    },
    {
      name: 'Health Supplement Pack',
      description: 'Vitamins and supplements for better health',
      category: 'health',
      price: 12000,
      stock_quantity: 25,
      image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 0
    },
    {
      name: 'Smartphone Accessories',
      description: 'Cases, chargers, and phone accessories',
      category: 'electronics',
      price: 5500,
      stock_quantity: 40,
      image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      is_featured: 1
    }
  ];

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, category, price, stock_quantity, image_url, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  sampleProducts.forEach(product => {
    insertProduct.run([
      product.name,
      product.description,
      product.category,
      product.price,
      product.stock_quantity,
      product.image_url,
      product.is_featured
    ]);
  });

  insertProduct.finalize();
}

module.exports = {
  createConnection,
  initializeDatabase
};
