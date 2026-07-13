# Lugat Dictionary

Mobile-first EN/UZ dictionary built with React and Vite.

## Scripts

- `npm run dev` starts the local Vite dev server
- `npm run lint` checks the code with ESLint
- `npm run build` creates a portable static build with relative asset paths
- `npm run build:web` creates the GitHub Pages build for the `dictionary` repository with relative asset paths
- `npm run build:android` creates a relative-path build for Capacitor/Android

## Deploy

Pushing `main` triggers the GitHub Actions workflow in `.github/workflows/npm-publish-github-packages.yml`, which builds the app and deploys `dist/` to GitHub Pages.
