@echo off
echo 🔗 Connecting Mayokun Stores to GitHub...
echo ========================================
echo.
echo ⚠️  IMPORTANT: You must edit this script first!
echo    Replace YOUR_USERNAME with your actual GitHub username
echo.

pause

REM Step 1: Add GitHub as remote origin
echo 📡 Adding GitHub remote...
echo Replace YOUR_USERNAME with your actual GitHub username in the line below:
echo git remote add origin https://github.com/YOUR_USERNAME/mayokun-stores.git
echo.
echo Example: If your username is "johndoe", the command should be:
echo git remote add origin https://github.com/johndoe/mayokun-stores.git
echo.
pause

REM Uncomment and edit the line below with your actual username:
REM git remote add origin https://github.com/YOUR_USERNAME/mayokun-stores.git

echo ========================================
echo 📝 TO COMPLETE SETUP:
echo 1. Edit this file and replace YOUR_USERNAME with your actual GitHub username
echo 2. Uncomment the git remote add line
echo 3. Run this script again
echo 4. Or run the commands manually:
echo    git remote add origin https://github.com/YOUR_ACTUAL_USERNAME/mayokun-stores.git
echo    git push -u origin main
echo ========================================

pause
