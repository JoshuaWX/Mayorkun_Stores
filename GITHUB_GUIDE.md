# 🚀 GitHub Quick Reference Guide for Mayokun Stores

## 📋 Current Status
- ✅ Git repository initialized
- ✅ Initial commit completed
- ✅ Remote origin configured
- ✅ Ready to push to GitHub

## 🔧 What You Need to Do Next

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Repository name: `mayokun-stores`
4. Description: `Modern e-commerce website for Mayokun Stores Limited`
5. Make it **Public** or **Private** (your choice)
6. **DON'T** check "Initialize with README" (we already have one)
7. Click **"Create repository"**

### 2. Update Remote URL
Replace the remote URL with your actual GitHub username:

```bash
# Remove the placeholder remote
git remote remove origin

# Add your actual GitHub repository
git remote add origin https://github.com/YOUR_ACTUAL_USERNAME/mayokun-stores.git
```

### 3. Push to GitHub
```bash
# Push your code to GitHub
git push -u origin main
```

### 4. Verify Upload
Visit your repository at: `https://github.com/YOUR_USERNAME/mayokun-stores`

## 🔄 Daily Git Workflow

### Making Changes
```bash
# 1. Check status
git status

# 2. Add files
git add .
# or add specific files
git add filename.html

# 3. Commit changes
git commit -m "Describe what you changed"

# 4. Push to GitHub
git push
```

### Useful Commands
```bash
# Check commit history
git log --oneline

# Check what's changed
git diff

# Check repository status
git status

# See remote repositories
git remote -v

# Pull latest changes (if working with others)
git pull
```

## 📱 GitHub Features You Can Use

### 1. GitHub Pages (Free Website Hosting)
- Go to repository Settings → Pages
- Select source: "Deploy from a branch"
- Choose branch: `main`
- Your site will be available at: `https://YOUR_USERNAME.github.io/mayokun-stores`

### 2. Issues & Project Management
- Track bugs and features in the Issues tab
- Use Projects for task management
- Add labels and milestones

### 3. Collaborators
- Go to Settings → Collaborators
- Add team members by username or email

### 4. Branch Protection
- Go to Settings → Branches
- Add protection rules for the main branch

## 🛠️ Troubleshooting

### "Permission denied" error
```bash
# Use personal access token instead of password
# Go to GitHub Settings → Developer settings → Personal access tokens
```

### "Repository not found" error
- Double-check the repository URL
- Make sure the repository exists on GitHub
- Verify your username spelling

### Push rejected error
```bash
# Pull latest changes first
git pull origin main
# Then push again
git push origin main
```

## 🎯 Next Steps After GitHub Setup

1. **Test the website** locally to ensure everything works
2. **Set up GitHub Pages** for live deployment
3. **Add collaborators** if working with a team
4. **Create issues** for future improvements
5. **Set up continuous integration** (optional)

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify your GitHub username and repository name
3. Ensure you have internet connectivity
4. Try the commands one by one

Remember to replace `YOUR_USERNAME` with your actual GitHub username in all commands!
