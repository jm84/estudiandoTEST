const fs = require('fs');
const path = require('path');

// Create the first directory structure
const dir1 = path.join('c:\\Users\\juani\\OneDrive\\Documentos\\prepExamenGCPDigitalLeader', 'gcp-digital-leader-app', 'src', 'app', 'core', 'initializers');
const file1 = path.join(dir1, 'questions-loader.ts');

// Create the second directory structure
const dir2 = path.join('c:\\Users\\juani\\OneDrive\\Documentos\\prepExamenGCPDigitalLeader', '.github', 'workflows');
const file2 = path.join(dir2, 'deploy.yml');

const file1Content = `import { inject } from '@angular/core';
import { QUESTION_REPOSITORY } from '../contracts/question-repository';
import { Question } from '../models/question.model';

export function questionsLoaderInitializer(): () => Promise<void> {
  const repository = inject(QUESTION_REPOSITORY);

  return async () => {
    if (repository.getAll().length > 0) {
      return;
    }

    try {
      const response = await fetch('questions.json');
      if (!response.ok) return;
      const questions = (await response.json()) as Question[];
      repository.saveAll(questions);
    } catch {
      // Si falla la carga del JSON el banco simplemente arranca vacío
    }
  };
}`;

const file2Content = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: gcp-digital-leader-app/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: gcp-digital-leader-app

      - name: Build
        run: npx ng build --configuration production --base-href "/${{ github.event.repository.name }}/"
        working-directory: gcp-digital-leader-app

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: gcp-digital-leader-app/dist/gcp-digital-leader-app/browser`;

try {
  // Create first directory and file
  fs.mkdirSync(dir1, { recursive: true });
  console.log('✓ Created directory: ' + dir1);
  
  fs.writeFileSync(file1, file1Content, 'utf8');
  console.log('✓ Created file: ' + file1);

  // Create second directory and file
  fs.mkdirSync(dir2, { recursive: true });
  console.log('✓ Created directory: ' + dir2);
  
  fs.writeFileSync(file2, file2Content, 'utf8');
  console.log('✓ Created file: ' + file2);
  
  console.log('\nVerifying files exist...');
  
  if (fs.existsSync(file1)) {
    const size1 = fs.statSync(file1).size;
    console.log('✓ Verified: questions-loader.ts (' + size1 + ' bytes)');
  }
  
  if (fs.existsSync(file2)) {
    const size2 = fs.statSync(file2).size;
    console.log('✓ Verified: deploy.yml (' + size2 + ' bytes)');
  }
  
  console.log('\n✅ All files and directories created successfully!');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
