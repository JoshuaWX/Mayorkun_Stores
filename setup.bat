@echo off
echo ============================================
echo   MAYOKUN STORES - QUICK SETUP GUIDE
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not found in PATH!
    echo.
    echo Please ensure Node.js is properly installed:
    echo 1. Download from https://nodejs.org/
    echo 2. Run the installer as Administrator
    echo 3. Restart your computer
    echo 4. Open Command Prompt (not Git Bash)
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed: 
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not found in PATH!
    echo npm should come with Node.js installation.
    echo Please reinstall Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ npm is available:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ Dependencies already installed.
)

echo.
echo 🚀 Starting Mayokun Stores Server...
echo.
echo ============================================
echo   SERVER INFORMATION
echo ============================================
echo Website URL: http://localhost:3000/home.html
echo Admin Panel: Coming soon
echo API Base: http://localhost:3000/api
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

REM Start the server
node server.js

echo.
echo Server stopped. Press any key to exit.
pause
