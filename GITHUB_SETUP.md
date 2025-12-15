# Getting Your Site to GitHub - Step by Step

## Quick Start Guide

Follow these steps to push your local site to GitHub.

## Step 1: Initialize Git Repository (if not already done)

Open Terminal and navigate to your project folder, then run:

```bash
cd /Volumes/Whale/_CLIENTS/PROJECT
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Make Your First Commit

```bash
git commit -m "Initial commit - SNOGRUB site ready for deployment"
```

## Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in:
   - **Repository name**: `snogrub` (or whatever you prefer)
   - **Description**: "Ski resort restaurant directory" (optional)
   - **Visibility**: Choose Public or Private
   - **IMPORTANT**: Do NOT check "Add a README file", "Add .gitignore", or "Choose a license" (you already have these)
5. Click **"Create repository"**

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use the "push an existing repository" option:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with the repository name you created

## Step 6: Verify

Go back to GitHub and refresh the page. You should see all your files!

## What Gets Pushed?

Your `.gitignore` file will automatically exclude:
- `node_modules/` (dependencies)
- `.DS_Store` (macOS system files)
- Backup files (`.backup` files)
- Environment files (`.env`)
- Vercel local files (`.vercel`)

## Troubleshooting

### If you get "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you get authentication errors
You may need to set up authentication:
- Use a Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

### If the repository is very large
GitHub has file size limits. If you have very large files, you might need to:
- Remove large backup files before committing
- Use Git LFS for large files

---

**Ready to proceed?** I can help you run these commands step by step!

