# 🏪 Mayokun Stores Limited - E-commerce Website

<div align="center">

![Mayokun Stores](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)

**Your Premier Destination for Quality Products and Exceptional Service**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

## 🌟 Overview

Mayokun Stores Limited is a modern, full-stack e-commerce website built for a premium retail store located in Ilorin, Kwara State, Nigeria. The platform offers a seamless shopping experience with user authentication, product management, and secure payment processing.

## ✨ Features

### 🎨 Frontend
- **Modern Design**: Glassmorphism UI with gradient backgrounds and smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover effects, transitions, and dynamic content loading
- **User Authentication**: Registration and login with real-time validation
- **Product Catalog**: Dynamic product display with search functionality
- **Image Gallery**: Showcasing store products and facilities
- **Service Pages**: Detailed information about offerings

### 🚀 Backend
- **RESTful API**: Well-structured endpoints for all operations
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations for products
- **Order Processing**: Complete order lifecycle management
- **Authentication**: JWT-based secure authentication
- **Database**: SQLite for reliable data storage
- **Security**: Helmet, CORS, rate limiting, input validation

### 🔒 Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet.js

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | SQLite3 |
| Authentication | JWT, bcryptjs |
| Security | Helmet, CORS, express-rate-limit |
| Validation | express-validator |

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mayokun-stores.git
   cd mayokun-stores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Using the setup script (Windows)
   setup.bat
   
   # Or manually
   node server.js
   ```

4. **Access the website**
   ```
   http://localhost:3000/home.html
   ```

## 📱 Pages & Features

| Page | Description | Features |
|------|-------------|----------|
| 🏠 Home | Landing page with hero section | CTA buttons, feature highlights |
| 📝 Register | User registration | Form validation, backend integration |
| 🔐 Login | User authentication | JWT tokens, session management |
| 🛍️ Products | Product catalog | Search, dynamic loading, pricing |
| 🖼️ Gallery | Image showcase | Lightbox effects, categories |
| 🔧 Services | Service offerings | Detailed descriptions, contact info |
| 💳 Payment | Order processing | Payment methods, order summary |

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register - User registration
POST /api/auth/login    - User login
GET  /api/auth/verify   - Token verification
```

### Users
```
GET  /api/users/profile - Get user profile
PUT  /api/users/profile - Update user profile
GET  /api/users/orders  - Get user orders
```

### Products
```
GET  /api/products         - List all products
GET  /api/products/search  - Search products
GET  /api/products/:id     - Get single product
```

### Orders
```
POST /api/orders           - Create new order
GET  /api/orders/:id       - Get order details
PUT  /api/orders/:id/status - Update order status
```

## 🏗️ Project Structure

```
mayokun-stores/
├── 📁 database/           # Database setup and migrations
│   └── init.js
├── 📁 routes/             # API routes
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   └── orders.js
├── 📄 *.html              # Frontend pages
├── 📄 server.js           # Express server
├── 📄 package.json        # Dependencies
├── 📄 .env                # Environment variables
└── 📄 README.md           # This file
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
DB_PATH=./database/mayokun_stores.db
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🚀 Deployment

### Option 1: Local Development
```bash
npm start
```

### Option 2: Production Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## 🧪 Testing

The application includes sample data and fallback mechanisms:
- Sample products are displayed if backend is unavailable
- Form validation works offline
- Responsive design tested on multiple devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Contact

**Mayokun Stores Limited**
- 📍 Address: Offa garage, off Ajase Ipo road, Ilorin, Kwara State
- 📞 Phone: 08038323369
- 📱 Mobile: 08035806759

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🙏 Acknowledgments

- Unsplash for high-quality images
- Modern web design principles
- Nigerian e-commerce best practices
- User experience optimization

---

<div align="center">

**Built with ❤️ for the people of Kwara State**

[Visit Our Website](http://localhost:3000/home.html) • [View Documentation](./INSTALLATION.md) • [Report Issues](https://github.com/yourusername/mayokun-stores/issues)

</div>
