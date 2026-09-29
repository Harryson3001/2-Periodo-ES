@echo off
setlocal
title DC Transportes - Inicializador

set "ROOT=%~dp0"
set "API=%ROOT%api"

if not exist "%API%\node_modules" (
  echo Dependencias da API nao encontradas. Instalando...
  pushd "%API%"
  call npm.cmd install
  if errorlevel 1 (
    echo Falha ao instalar as dependencias da API.
    pause
    exit /b 1
  )
  popd
)

start "DC Transportes - API" cmd /k "cd /d "%API%" && echo Iniciando API em http://localhost:3333 && call npm.cmd run dev"
start "DC Transportes - Front" cmd /k "cd /d "%ROOT%" && echo Front em http://localhost:5500 && python -m http.server 5500"

echo.
echo API:   http://localhost:3333
echo Front: http://localhost:5500
echo Painel: http://localhost:5500/frontend/admin/login.html
echo.
timeout /t 3 >nul
endlocal
