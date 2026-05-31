#!/usr/bin/env node
// Run once from the project root to create the GitHub Actions workflow:
//   node setup-final.js

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const workflowDir = path.join(root, '.github', 'workflows');
const workflowFile = path.join(workflowDir, 'deploy.yml');

const deployLines = [
  'name: Deploy to GitHub Pages',
  '',
  'on:',
  '  push:',
  '    branches: [main]',
  '  workflow_dispatch:',
  '',
  'permissions:',
  '  contents: write',
  '',
  'jobs:',
  '  build-and-deploy:',
  '    runs-on: ubuntu-latest',
  '',
  '    steps:',
  '      - name: Checkout',
  '        uses: actions/checkout@v4',
  '',
  '      - name: Setup Node.js',
  '        uses: actions/setup-node@v4',
  '        with:',
  "          node-version: '20'",
  "          cache: 'npm'",
  '          cache-dependency-path: gcp-digital-leader-app/package-lock.json',
  '',
  '      - name: Install dependencies',
  '        run: npm ci',
  '        working-directory: gcp-digital-leader-app',
  '',
  '      - name: Build',
  '        run: npx ng build --configuration production --base-href "/${{ github.event.repository.name }}/"',
  '        working-directory: gcp-digital-leader-app',
  '',
  '      - name: Deploy to GitHub Pages',
  '        uses: peaceiris/actions-gh-pages@v4',
  '        with:',
  '          github_token: ${{ secrets.GITHUB_TOKEN }}',
  '          publish_dir: gcp-digital-leader-app/dist/gcp-digital-leader-app/browser',
  ''
];
const deployYml = deployLines.join('\n');

try {
  fs.mkdirSync(workflowDir, { recursive: true });
  fs.writeFileSync(workflowFile, deployYml, 'utf8');
  console.log('✅ Created: ' + workflowFile);
  console.log('\nNext steps:');
  console.log('  1. git init && git add . && git commit -m "initial commit"');
  console.log('  2. Create repo in GitHub and push');
  console.log('  3. Enable GitHub Pages (Settings > Pages > Source: gh-pages branch)');
} catch (err) {
  console.error('❌ ERROR:', err.message);
  process.exit(1);
}
