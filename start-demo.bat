@echo off
TITLE Railway AI Intelligence Center - Launcher
echo ======================================================================
echo           RAILWAY AI INTELLIGENCE CENTER - STARTUP LAUNCHER
echo ======================================================================
echo.
echo [1/3] Checking MongoDB...
echo Make sure MongoDB service is running (localhost:27017).
echo.
echo [2/3] Starting Backend API & Socket.IO server (Port 5000)...
start "Backend - Node.js" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting React Dashboard (Port 5173)...
start "Frontend - React Vite" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ======================================================================
echo  SYSTEM READY!
echo  Dashboard: http://localhost:5173
echo  Backend:   http://localhost:5000/api/health
echo  ESP32 Ingestion: POST http://localhost:5000/api/sensor-data
echo.
echo  Optional Simulator (run in a new window if hardware is not connected):
echo  cd backend && npm run simulate
echo ======================================================================
echo.
pause
