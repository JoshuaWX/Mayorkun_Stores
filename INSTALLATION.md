# 🚀 MAYOKUN STORES - INSTALLATION GUIDE

## Step-by-Step Instructions

### Option 1: Windows Users (Recommended)
1. **Open Command Prompt as Administrator**
   - Press `Win + X` and select "Command Prompt (Admin)" or "PowerShell (Admin)"
   - Navigate to your project folder:
     ```cmd
     cd "C:\Users\Admin\OneDrive\Desktop\VSU\mayorkun"
     ```

2. **Run the Setup Script**
   ```cmd
   setup.bat
   ```

3. **Access Your Website**
   - Open your browser and go to: http://localhost:3000/home.html

### Option 2: Git Bash/Linux/Mac Users
1. **Open Terminal**
   - Navigate to your project folder:
     ```bash
     cd "/c/Users/Admin/OneDrive/Desktop/VSU/mayorkun"
     ```

2. **Run the Setup Script**
   ```bash
   ./setup.sh
   ```

3. **Access Your Website**
   - Open your browser and go to: http://localhost:3000/home.html

## Manual Installation (If scripts don't work)

### 1. Verify Node.js Installation
```bash
node --version
npm --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
node server.js
```

## 🎯 What You'll See

### When Setup is Successful:
- ✅ Node.js version displayed
- ✅ npm version displayed  
- ✅ Dependencies installed
- 🚀 Server starts on port 3000
- 🌐 Website accessible at http://localhost:3000/home.html

### Website Features:
- 🏠 **Home Page**: Modern landing page with hero section
- 📝 **Registration**: User signup with backend integration
- 🔐 **Login**: User authentication system
- 🛍️ **Products**: Dynamic product catalog with search
- 🖼️ **Gallery**: Image gallery showcasing products
- 🔧 **Services**: Service offerings
- 💳 **Payment**: Order management system

## 🔧 Troubleshooting

### Common Issues:

1. **"node is not recognized"**
   - Node.js is not installed or not in PATH
   - Reinstall Node.js from https://nodejs.org/
   - Choose "Add to PATH" during installation

2. **"npm install fails"**
   - Check internet connection
   - Run as Administrator
   - Clear npm cache: `npm cache clean --force`

3. **"Port 3000 is already in use"**
   - Change port in `.env` file: `PORT=3001`
   - Or stop other applications using port 3000

4. **"Cannot access website"**
   - Ensure server is running
   - Check if Windows Firewall is blocking
   - Try http://127.0.0.1:3000/home.html instead

## 📱 Testing the Features

### Test Registration:
1. Go to http://localhost:3000/register.html
2. Fill out the registration form
3. Submit and check for success message

### Test Login:
1. Go to http://localhost:3000/login.html
2. Use the account you just created
3. Should redirect to home page with welcome message

### Test Products:
1. Go to http://localhost:3000/product.html
2. Use the search bar to find products
3. Products should load dynamically

## 🎉 Success!

If everything is working:
- Your website is now running with a full backend
- Users can register and login
- Products are loaded dynamically
- All pages are connected and functional

## 🆘 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Ensure all files are in the correct directory
3. Verify Node.js is properly installed
4. Try running commands manually step by step

The Mayokun Stores website is now a full-stack application with user authentication, product management, and modern web design!
