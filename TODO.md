- [x] Inspect logs / confirm error source (Vercel build) : /vercel/path0/node_modules/.bin/vite permission denied
- [x] Add robust fix: postinstall chmod +x on node_modules/.bin/vite and other .bin scripts
- [x] Update package.json with postinstall script
- [x] Run local clean install and build: rm -rf node_modules dist && npm ci && npm run build

- [x] Redeploy to Vercel and verify build



