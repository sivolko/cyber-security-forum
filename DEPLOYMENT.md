# Deployment Guide

## Quick Deployment to GitHub Pages

### Prerequisites
- GitHub account
- Basic knowledge of Git/GitHub

### Step 1: Fork or Clone Repository

**Option A: Fork the Repository (Recommended)**
1. Visit the repository: `https://github.com/sivolko/cyber-security-forum`
2. Click the "Fork" button in the top-right corner
3. Choose your GitHub account as the destination

**Option B: Create New Repository**
1. Create a new repository on GitHub
2. Clone this repository locally:
   ```bash
   git clone https://github.com/sivolko/cyber-security-forum.git
   cd cyber-security-forum
   ```
3. Update the remote origin:
   ```bash
   git remote set-url origin https://github.com/YOURUSERNAME/YOURREPONAME.git
   git push -u origin main
   ```

### Step 2: Configure Repository Settings

1. **Enable GitHub Discussions**
   - Go to your repository Settings
   - Scroll to "Features" section
   - Check "Discussions"
   - Click "Set up discussions"

2. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Click "Save"

3. **Configure Actions (if needed)**
   - Go to Settings > Actions > General
   - Ensure "Allow all actions and reusable workflows" is selected
   - Set workflow permissions to "Read and write permissions"

### Step 3: Update Configuration

Edit `_config.yml` with your details:

```yaml
# Site settings
title: "Your Forum Name"
description: "Your forum description"
baseurl: "/your-repository-name"  # Change this
url: "https://yourusername.github.io"  # Change this

# GitHub settings
github:
  username: yourusername  # Change this
  repository: your-repository-name  # Change this
```

### Step 4: Customize Categories (Optional)

To modify discussion categories, edit the `categories` section in `_config.yml`:

```yaml
categories:
  - name: "Your Category"
    slug: "your-category"
    icon: "🔧"  # Use any emoji
    color: "#ff6600"  # Hex color code
```

### Step 5: Deploy

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Configure forum for deployment"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to Actions tab in your GitHub repository
   - Wait for the "Deploy Jekyll site to Pages" workflow to complete
   - Check for any errors in the workflow logs

3. **Access your forum:**
   - Visit: `https://yourusername.github.io/your-repository-name`
   - It may take 5-10 minutes for the site to be available

## Local Development

### Prerequisites
- Ruby 3.1 or higher
- Bundler
- Git

### Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
   gem install bundler jekyll
   bundle install
   ```

2. **Serve locally:**
   ```bash
   bundle exec jekyll serve
   ```

3. **Open in browser:**
   ```
   http://localhost:4000/your-repository-name
   ```

### Development Workflow

1. **Make changes** to your files
2. **Test locally** using `bundle exec jekyll serve`
3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. **GitHub Actions** will automatically deploy to GitHub Pages

## Advanced Configuration

### Custom Domain

1. **Purchase and configure DNS:**
   - Point your domain to GitHub Pages
   - Create CNAME record: `yourdomain.com` → `yourusername.github.io`

2. **Configure in GitHub:**
   - Go to Settings > Pages
   - Custom domain: `yourdomain.com`
   - Check "Enforce HTTPS"

3. **Update `_config.yml`:**
   ```yaml
   url: "https://yourdomain.com"
   baseurl: ""
   ```

### Environment Variables

For sensitive configuration, use GitHub repository secrets:

1. Go to Settings > Secrets and variables > Actions
2. Add repository secrets
3. Reference in workflows as: `${{ secrets.SECRET_NAME }}`

### Analytics Integration

Add Google Analytics or similar:

1. **Update `_config.yml`:**
   ```yaml
   google_analytics: GA_MEASUREMENT_ID
   ```

2. **Add tracking code** to `_layouts/default.html`

### GitHub API Integration

For live GitHub data (optional):

1. **Create GitHub Personal Access Token:**
   - Go to Settings > Developer settings > Personal access tokens
   - Generate token with `public_repo` scope

2. **Add as repository secret:**
   - Name: `GITHUB_TOKEN`
   - Value: Your personal access token

3. **Update JavaScript** in `assets/js/main.js` to use real GitHub API

## Security Considerations

### Content Security Policy

Add to `_layouts/default.html` head section:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; script-src 'self'; img-src 'self' data: avatars.githubusercontent.com;">
```

### Rate Limiting

- GitHub API has rate limits (60 requests/hour for unauthenticated)
- Consider caching GitHub API responses
- Implement fallback to mock data

### User-Generated Content

- All discussions happen on GitHub (moderated by repository maintainers)
- No direct user input on the forum site
- Links to GitHub for creating/replying to discussions

## Troubleshooting

### Common Issues

1. **Site not loading:**
   - Check GitHub Actions for build errors
   - Verify `baseurl` and `url` in `_config.yml`
   - Ensure GitHub Pages is enabled

2. **CSS/JS not loading:**
   - Check file paths in `_layouts/default.html`
   - Verify `baseurl` configuration
   - Clear browser cache

3. **GitHub API errors:**
   - Check API rate limits
   - Verify repository exists and is public
   - Check browser console for JavaScript errors

4. **Mobile display issues:**
   - Test on various devices
   - Check CSS media queries
   - Verify viewport meta tag

### Debug Mode

Enable Jekyll debug output:

```bash
JEKYLL_ENV=development bundle exec jekyll serve --verbose
```

### Support

For issues:
1. Check existing GitHub Issues
2. Review deployment logs in Actions tab
3. Test with local development environment
4. Create new issue with detailed error information

## Performance Optimization

### Image Optimization
- Use SVG for icons and simple graphics
- Optimize avatar images
- Implement lazy loading for images

### Caching
- GitHub Pages provides CDN caching
- Set appropriate cache headers
- Use service workers for offline functionality

### Bundle Size
- Minimize CSS and JavaScript
- Remove unused dependencies
- Use tree-shaking for JavaScript modules

---

**Deployment Time: ~10 minutes**

**Estimated Setup Time: 30-60 minutes (including customization)**