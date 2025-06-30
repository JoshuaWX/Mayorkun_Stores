#!/bin/bash

echo "============================================"
echo "   MAYOKUN STORES - QUICK SETUP GUIDE"
echo "============================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo
    echo "Please install Node.js:"
    echo "1. Visit https://nodejs.org/"
    echo "2. Download and install the LTS version"
    echo "3. Restart your terminal"
    echo "4. Run this script again"
    echo
    exit 1
fi

echo "✅ Node.js is installed:"
node --version
echo

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not available!"
    echo "npm should come with Node.js installation."
    echo "Please reinstall Node.js from https://nodejs.org/"
    echo
    exit 1
fi

echo "✅ npm is available:"
npm --version
echo

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        echo "Please check your internet connection and try again."
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
else
    echo "✅ Dependencies already installed."
fi

echo
echo "🚀 Starting Mayokun Stores Server..."
echo
echo "============================================"
echo "   SERVER INFORMATION"
echo "============================================"
echo "Website URL: http://localhost:3000/home.html"
echo "Admin Panel: Coming soon"
echo "API Base: http://localhost:3000/api"
echo
echo "Press Ctrl+C to stop the server"
echo "============================================"
echo

# Start the server
node server.js
