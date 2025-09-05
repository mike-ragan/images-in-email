# Gmail Carousel Image Verifier - Lean Netlify Deployment

This is a minimal deployment package for the Image Parameter Verifier tool, optimized for Netlify deployment.

## 📁 Package Contents

```
netlify-deploy/
├── index.html              # Frontend interface
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies (Sharp for image processing)
├── netlify/
│   └── functions/
│       └── analyze.js      # Serverless function for image analysis
└── README.md              # This file
```

## 🚀 Quick Deployment to Netlify

### Method 1: Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Deploy from this directory
cd netlify-deploy
netlify deploy --prod
```

### Method 2: GitHub Integration
1. Push this `netlify-deploy` folder to a GitHub repository
2. Connect the repository to Netlify
3. Set build directory to root (`/`)

## ✅ What's Included vs Original

**Included (Essential Files Only):**
- ✅ Frontend HTML with enhanced UI
- ✅ Serverless function with Sharp image processing
- ✅ Netlify configuration
- ✅ Package dependencies

**Excluded (Unnecessary for Deployment):**
- ❌ Node.js server files (`server.js`)
- ❌ CloudPage experiments (`cloudpage/`)
- ❌ Development dependencies (`node_modules/`)
- ❌ Test files and documentation
- ❌ Alternative deployment files

## 🎯 After Deployment

The serverless function will provide complete file size analysis that bypasses all CORS restrictions.

## 📊 Gmail Carousel Specifications

The tool validates images against Gmail's carousel requirements:
- **Square**: 1:1 ratio, min 300x300px
- **Horizontal**: 1.91:1 ratio, min 600x314px  
- **Vertical**: 4:5 ratio, min 480x600px
- **File Size**: Under 102KB recommended
- **Format**: JPEG, PNG, GIF, WebP
- **Protocol**: HTTPS required
