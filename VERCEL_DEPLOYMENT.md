# Vercel Deployment Guide

This guide will walk you through deploying your SNOGRUB site to Vercel.

## Prerequisites

- ✅ Vercel account (you mentioned you already have one)
- ✅ GitHub account (you mentioned you already have one)
- ✅ Project code committed to a Git repository

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

If your project isn't already a Git repository:

```bash
git init
git add .
git commit -m "Initial commit - ready for Vercel deployment"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `snogrub` or `ski-restaurant-directory`)
5. Choose public or private
6. **Do NOT** initialize with README, .gitignore, or license (since you already have these)
7. Click "Create repository"

### 1.3 Push to GitHub

GitHub will show you commands. Run these in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - You'll see a list of your GitHub repositories
   - Find and select your repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Select "Other" (since this is a static site)
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: Leave empty (no build needed for static site)
   - **Output Directory**: Leave as `.` (root)
   - **Install Command**: `npm install` (or leave default)

4. **Environment Variables** (if needed)
   - If you have any API keys or environment variables, add them here
   - Click "Add" for each variable

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies
     - Deploy your site
     - Provide you with a deployment URL

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new? (Choose "Create new")
   - Project name? (Enter your project name)
   - Directory? (Press Enter for current directory)
   - Override settings? (Press Enter for no)

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain (e.g., `snogrub.com`)
4. Follow Vercel's instructions to configure DNS:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records as instructed by Vercel

## Step 4: Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- ✅ Deploy every push to the `main` branch (production)
- ✅ Create preview deployments for pull requests
- ✅ Provide deployment URLs for each commit

## Configuration Details

The `vercel.json` file in your project root configures:

- **Static Site**: No build process needed
- **Security Headers**: XSS protection, frame options, content type options
- **Caching**: Optimized caching for static assets (JS, CSS, images)
- **Clean URLs**: Removes `.html` extension from URLs
- **Trailing Slash**: Handled automatically

## Troubleshooting

### Issue: 404 Errors on Routes

If you're getting 404 errors, make sure:
- Your HTML files are in the root directory
- The `vercel.json` file is properly configured
- File names match the routes exactly

### Issue: Assets Not Loading

Check that:
- Asset paths are relative (e.g., `./js/file.js` not `/js/file.js`)
- Or use absolute paths from root (e.g., `/js/file.js`)

### Issue: Environment Variables

If you need environment variables:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy the project

## Next Steps

After deployment:

1. **Test Your Site**: Visit your Vercel deployment URL
2. **Check All Pages**: Navigate through all your pages to ensure they work
3. **Test on Mobile**: Use Vercel's mobile preview or test on actual devices
4. **Set Up Analytics** (optional): Add Vercel Analytics in project settings
5. **Monitor Performance**: Use Vercel's dashboard to monitor performance

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

---

**Your site is now ready to deploy!** 🚀

Follow Step 1 to push your code to GitHub, then proceed with Step 2 to deploy to Vercel.

