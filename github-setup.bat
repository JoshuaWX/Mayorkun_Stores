@echo off
echo 🔗 Connecting Mayokun Stores to GitHub...
echo ========================================

REM Step 1: Add GitHub as remote origin
echo 📡 Adding GitHub remote...
git remote add origin https://github.com/YOUR_USERNAME/mayokun-stores.git

REM Step 2: Verify remote was added
echo ✅ Verifying remote connection...
git remote -v

REM Step 3: Push to GitHub
echo 🚀 Pushing to GitHub main branch...
git push -u origin main

echo ========================================
echo ✅ SUCCESS! Your repository is now on GitHub!
echo.
echo 🌐 Repository URL: https://github.com/YOUR_USERNAME/mayokun-stores
echo 📝 Next steps:
echo    1. Visit your repository on GitHub
echo    2. Add collaborators if needed
echo    3. Set up GitHub Pages for deployment
echo    4. Configure branch protection rules
echo.
echo 🔄 For future updates, use:
echo    git add .
echo    git commit -m "Your commit message"
echo    git push

pause
