# Next Steps - Push to GitHub

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `snogrub` (or your choice)
   - **Description**: "Ski resort restaurant directory" (optional)
   - **Visibility**: Public or Private
   - ⚠️ **DO NOT** check any boxes (no README, .gitignore, or license)
3. Click **"Create repository"**

## Step 2: Copy Your Repository URL

After creating, GitHub will show you a URL like:
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 3: Run These Commands

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
cd /Volumes/Whale/_CLIENTS/PROJECT
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 4: Authenticate

If prompted for authentication:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)

### How to Create a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Vercel Deployment"
4. Check the `repo` scope
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Step 5: After Pushing

Once your code is on GitHub, you can:
1. Deploy to Vercel (see `VERCEL_DEPLOYMENT.md`)
2. Vercel will automatically detect your GitHub repo
3. Your site will be live!

---

**Need help?** Just share your GitHub repository URL and I can help you push!

