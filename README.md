# Mayokun Stores - Backend Setup Guide

## Prerequisites
Before running the application, you need to install Node.js on your system.

### Installing Node.js on Windows:
1. Visit https://nodejs.org/
2. Download the LTS version for Windows
3. Run the installer and follow the installation wizard
4. Restart your terminal/command prompt

## Setup Instructions

### 1. Install Dependencies
Open a terminal in this project directory and run:
```bash
npm install
```

### 2. Initialize Database
The database will be automatically created when you first start the server.

### 3. Start the Server
```bash
npm start
```
Or alternatively:
```bash
node server.js
```

The server will start on http://localhost:3000

### 4. Access the Website
Open your web browser and navigate to:
- Main site: http://localhost:3000/home.html
- Registration: http://localhost:3000/register.html
- Login: http://localhost:3000/login.html

## Features

### Frontend
- ✅ Modern, responsive design with glassmorphism effects
- ✅ User registration and login forms
- ✅ Product catalog with search functionality
- ✅ Image gallery
- ✅ Service information
- ✅ Payment/order management interface
- ✅ Mobile-friendly navigation

### Backend API
- ✅ User authentication (register/login/logout)
- ✅ JWT token-based sessions
- ✅ SQLite database for data storage
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting for security
- ✅ CORS support for cross-origin requests

### Database Schema
- **users**: User accounts with profiles
- **admin_users**: Administrative accounts
- **products**: Product catalog
- **orders**: Customer orders
- **order_items**: Individual order items
- **contact_messages**: Customer inquiries
- **payment_transactions**: Payment records

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user orders

### Products
- `GET /api/products` - List all products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## Environment Variables
The `.env` file contains configuration settings:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens
- `DB_PATH`: Database file path
- `RATE_LIMIT_WINDOW`: Rate limiting window in minutes
- `RATE_LIMIT_MAX`: Maximum requests per window

## Security Features
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Input validation and sanitization
- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention with parameterized queries

## Troubleshooting

### Common Issues:
1. **Port already in use**: Change the PORT in .env file
2. **Database errors**: Delete the database file and restart the server
3. **Permission errors**: Ensure the application has write permissions in the directory

### Development Mode:
For development, you can use nodemon for auto-restart:
```bash
npm install -g nodemon
nodemon server.js
```

## Next Steps
1. Install Node.js if not already installed
2. Run `npm install` to install dependencies
3. Start the server with `npm start`
4. Open http://localhost:3000/home.html in your browser
5. Test registration and login functionality
6. Explore the integrated features

The website now has a fully functional backend with user authentication, product management, and order processing capabilities!
