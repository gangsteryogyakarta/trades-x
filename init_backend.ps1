# PowerShell Script to Initialize Laravel Backend Safely

Write-Host "Starting Trades-X Backend Initialization..." -ForegroundColor Cyan

# Define paths
$BackendDir = "backend"
$BackupDir = "backend_backup"

# 1. Backup existing custom code
if (Test-Path $BackendDir) {
    Write-Host "Backing up existing files..." -ForegroundColor Yellow
    if (Test-Path $BackupDir) { Remove-Item -Recurse -Force $BackupDir }
    Copy-Item -Recurse $BackendDir $BackupDir
    
    # Clean backend directory for composer (keep .gitkeep if exists, but composer needs empty dir usually)
    # We will remove the dir content but keep the dir
    Get-ChildItem -Path $BackendDir -Recurse | Remove-Item -Recurse -Force
}
else {
    New-Item -ItemType Directory -Path $BackendDir
}

# 2. Run Laravel Installer via Docker
Write-Host "Running Laravel Installer (this may take a few minutes)..." -ForegroundColor Cyan
try {
    # Using local composer (Laragon environment detected)
    Invoke-Expression "composer create-project laravel/laravel $BackendDir --prefer-dist"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Laravel installation failed with exit code $LASTEXITCODE"
    }
}
catch {
    Write-Error "Error occurred: $_"
    Write-Host "Restoring backup..." -ForegroundColor Yellow
    Copy-Item -Recurse -Force "$BackupDir\*" $BackendDir
    exit 1
}

# 3. Restore Custom Code
Write-Host "Restoring custom code (Migrations, Models, Controllers)..." -ForegroundColor Yellow

# Copy folders back, overwriting generated files if conflict
Copy-Item -Recurse -Force "$BackupDir\app" "$BackendDir"
Copy-Item -Recurse -Force "$BackupDir\database" "$BackendDir"
Copy-Item -Recurse -Force "$BackupDir\routes" "$BackendDir"

# 4. Install dependencies (Sanctum is usually included, but ensure others are there)
Write-Host "Installing additional dependencies..." -ForegroundColor Cyan
# docker-compose run --rm backend composer require laravel/sanctum spatie/laravel-permission

# 5. Clean up
Remove-Item -Recurse -Force $BackupDir

Write-Host "Backend Initialization Complete!" -ForegroundColor Green
Write-Host "Next Step: Run 'docker-compose up -d' and then 'docker-compose run --rm backend php artisan migrate'" -ForegroundColor White
