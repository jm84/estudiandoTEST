@echo off
REM Create the directory structure for initializers
mkdir "c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\gcp-digital-leader-app\src\app\core\initializers"
if exist "c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\gcp-digital-leader-app\src\app\core\initializers" (
    echo ✓ Created initializers directory
) else (
    echo ✗ Failed to create initializers directory
)

REM Create the GitHub Actions workflow directory
mkdir "c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\.github\workflows"
if exist "c:\Users\juani\OneDrive\Documentos\prepExamenGCPDigitalLeader\.github\workflows" (
    echo ✓ Created .github/workflows directory
) else (
    echo ✗ Failed to create .github/workflows directory
)
