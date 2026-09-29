@echo off
taskkill /FI "WINDOWTITLE eq DC Transportes - API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq DC Transportes - Front*" /T /F >nul 2>&1
echo Processos do DC Transportes encerrados.
pause
