# CyberSec Forum

🔒 A modern, responsive cybersecurity discussion forum powered by GitHub Discussions and Jekyll.

## Features

- **Clean, Reddit-inspired Dark Theme** - Modern UI optimized for readability
- **Category-based Organization** - Discussions organized by cybersecurity domains
- **Search & Filtering** - Powerful search with category and time-based filters
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **GitHub Integration** - Leverages GitHub Discussions for backend
- **No Authentication Required** - Browse and read without logging in
- **Tag System** - Organize content with relevant tags
- **Real-time Stats** - Activity metrics and popular tags

## Categories

- 🔍 **Vulnerability Research** - CVEs, zero-days, and security research
- 🚨 **Incident Response** - Breach analysis and response strategies
- 🕵️ **Threat Intelligence** - APT campaigns and threat analysis
- 🦠 **Malware Analysis** - Reverse engineering and malware research
- ⚔️ **Penetration Testing** - Red team exercises and testing methodologies
- 🛠️ **Security Tools** - Tool reviews, configurations, and custom solutions
- 📋 **Compliance & Governance** - Regulatory requirements and frameworks
- 📰 **Security News** - Latest security developments and updates

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sivolko/cyber-security-forum.git
   cd cyber-security-forum
   ```

2. **Install Jekyll and dependencies**
   ```bash
   gem install bundler jekyll
   bundle install
   ```

3. **Serve the site locally**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:4000/cyber-security-forum`

### GitHub Pages Deployment

1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/" (root) folder
   - Save settings

2. **Enable GitHub Discussions**
   - Go to repository Settings > General
   - Scroll down to "Features"
   - Check "Discussions"

3. **Access your forum**
   Visit `https://yourusername.github.io/cyber-security-forum`

## Configuration

Edit `_config.yml` to customize:

```yaml
# Site settings
title: "Your Forum Name"
description: "Your forum description"
baseurl: "/your-repo-name"
url: "https://yourusername.github.io"

# GitHub settings
github:
  username: yourusername
  repository: your-repo-name
```

## Customization

### Adding New Categories

Edit `_config.yml` and add to the categories section:

```yaml
categories:
  - name: "Your Category"
    slug: "your-category"
    icon: "🔧"
    color: "#ff6600"
```

### Styling

Customize the theme by editing `assets/css/main.css`. The design uses CSS custom properties for easy theming:

```css
:root {
  --bg-primary: #0b1426;
  --text-primary: #d7dadc;
  --accent-primary: #ff4500;
  /* ... more variables */
}
```

### GitHub Integration

The forum integrates with GitHub in several ways:

- **Discussions** - Primary content source
- **Issues** - Fallback for discussions
- **Profile Integration** - Author information
- **Direct Links** - Links back to GitHub for participation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Security

This forum is designed for cybersecurity professionals. Please:

- Follow responsible disclosure for vulnerabilities
- Don't share actual exploit code
- Respect privacy and confidentiality
- Use content warnings for sensitive material

## Resources

- [OWASP](https://owasp.org) - Open Web Application Security Project
- [CVE Database](https://cve.mitre.org) - Common Vulnerabilities and Exposures
- [MITRE ATT&CK](https://attack.mitre.org) - Adversarial Tactics and Techniques
- [NIST Framework](https://www.nist.gov/cyberframework) - Cybersecurity Framework

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For issues or questions:
- Open an issue on GitHub
- Start a discussion in the forum
- Check existing documentation

---

**Built with ❤️ for the cybersecurity community**