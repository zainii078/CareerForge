# CareerForge - Start All Services (Windows PowerShell)
# Requires: Node.js, Python 3.10+, MongoDB running on localhost:27017

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting CareerForge services..." -ForegroundColor Cyan

# AI Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\ai-service'; pip install -r requirements.txt -q; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 2

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm install; npm run dev"

Start-Sleep -Seconds 3

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm install; npm run dev"

Write-Host ""
Write-Host "Services starting in separate windows:" -ForegroundColor Green
Write-Host "  AI Service:  http://127.0.0.1:8000/health"
Write-Host "  Backend:     http://127.0.0.1:5000/api/health"
Write-Host "  Frontend:    http://localhost:3000"
Write-Host ""
Write-Host "Demo accounts (run 'npm run seed' in backend first):"
Write-Host "  Job Seeker:  seeker@careerforge.com / seeker123"
Write-Host "  Recruiter:   recruiter@careerforge.com / recruiter123"
