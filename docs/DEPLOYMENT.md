# Atmosphere Weather — Deployment Guide

This guide provides step-by-step instructions for publishing Atmosphere Weather to GitHub and deploying to free, production-grade static hosting platforms.

---

## 1. Publishing to GitHub

Follow these steps to initialize Git, create your commit history, and push to GitHub:

### Step 1: Initialize Git Repository
In your project terminal root:
```bash
git init
```

### Step 2: Configure .gitignore
Ensure your `.gitignore` excludes `node_modules`, `dist`, `.env`, and local temporary files:
```gitignore
node_modules
dist
dist-ssr
*.local
.DS_Store
```

### Step 3: Create Initial Commit
```bash
git add .
git commit -m "feat: initial release of Atmosphere Weather v0.1.0"
```

### Step 4: Create Remote Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click **New Repository** (`https://github.com/new`).
3. Set repository name: `atmosphere-weather`.
4. Choose **Public**.
5. Do not initialize with README, `.gitignore`, or license (they already exist in this project).
6. Click **Create repository**.

### Step 5: Link Remote and Push
```bash
git remote add origin https://github.com/<your-username>/atmosphere-weather.git
git branch -M main
git push -u origin main
```

---

## 2. Deploying to Free Hosting Services

Because Atmosphere Weather is a static Single Page Application (SPA) with no database or backend servers required, it can be deployed for free on any modern hosting platform.

### Option A: Vercel (Recommended)

1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project** and select `atmosphere-weather`.
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.
5. Your live app URL will be available immediately (e.g., `https://atmosphere-weather.vercel.app`).

### Option B: Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository `atmosphere-weather`.
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### Option C: Netlify

1. Log in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select `atmosphere-weather`.
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy atmosphere-weather**.

### Option D: GitHub Pages

1. Install `gh-pages` if desired or configure GitHub Actions:
2. In your repo on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Source: GitHub Actions**.
4. Select the standard **Static HTML** or **Vite** action workflow to publish directly from the `main` branch.

---

## 3. Environment Configuration & Variables

Atmosphere Weather does **not require any API keys or secret credentials** to run. Open-Meteo's weather and geocoding services are open access under the CC BY 4.0 license.

No environment variables are needed for basic operation. If you wish to configure a custom domain or custom base path, you can set `base` in `vite.config.ts`.

---

## 4. Troubleshooting Common Deployment Issues

| Issue | Cause | Solution |
|---|---|---|
| **404 on page refresh** | SPA routing fallback missing on static hosts. | Add a rewrite rule redirecting `/*` to `/index.html` (e.g., `vercel.json` or `_redirects` for Netlify: `/* /index.html 200`). |
| **Geolocation fails on HTTP** | Modern browsers restrict `navigator.geolocation` to secure contexts (HTTPS). | Ensure your deployed site uses HTTPS (automatically provided by Vercel, Netlify, and Cloudflare Pages). |
| **Mixed Content Warning** | Attempting to fetch HTTP resources from an HTTPS page. | All Open-Meteo and BigDataCloud endpoints in Atmosphere Weather strictly use `https://`. |
