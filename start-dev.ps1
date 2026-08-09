# WINFLAG — Dev startup script
# Run from the project root: .\start-dev.ps1

Write-Host "Starting WINFLAG development servers..." -ForegroundColor Cyan

# Start API in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\src\Winflag.API'; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start React frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Servers starting:" -ForegroundColor Green
Write-Host "  API:      http://localhost:5000"  -ForegroundColor Yellow
Write-Host "  API Docs: http://localhost:5000/openapi/v1.json" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Admin login: admin@winflag.in / Admin@123" -ForegroundColor Magenta
