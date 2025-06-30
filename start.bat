@echo off
echo Starting Mayokun Stores Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart this script.
    pause
    exit /b 1
)

echo Node.js is installed. Checking dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting the server...
echo.
echo The application will be available at:
echo http://localhost:3000/home.html
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js
