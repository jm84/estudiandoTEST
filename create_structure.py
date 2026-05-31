import os
from pathlib import Path

# Create the first directory structure
dir1 = r'c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\gcp-digital-leader-app\src\app\core\initializers'
Path(dir1).mkdir(parents=True, exist_ok=True)
print(f'✓ Created directory: {dir1}')

# Create the second directory structure
dir2 = r'c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\.github\workflows'
Path(dir2).mkdir(parents=True, exist_ok=True)
print(f'✓ Created directory: {dir2}')

# Now create the files
file1_path = os.path.join(dir1, 'questions-loader.ts')
file1_content = '''import { inject } from '@angular/core';
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
}'''

with open(file1_path, 'w', encoding='utf-8') as f:
    f.write(file1_content)
print(f'✓ Created file: {file1_path}')

# Verify file exists
if os.path.exists(file1_path):
    print(f'✓ Verified: questions-loader.ts exists ({os.path.getsize(file1_path)} bytes)')

file2_path = os.path.join(dir2, 'deploy.yml')
file2_content = '''name: Deploy to GitHub Pages

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
          publish_dir: gcp-digital-leader-app/dist/gcp-digital-leader-app/browser'''

with open(file2_path, 'w', encoding='utf-8') as f:
    f.write(file2_content)
print(f'✓ Created file: {file2_path}')

# Verify file exists
if os.path.exists(file2_path):
    print(f'✓ Verified: deploy.yml exists ({os.path.getsize(file2_path)} bytes)')

print('\n✅ All directories and files created successfully!')
