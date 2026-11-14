@echo off
chcp 65001 >nul
title Integra - Vista previa local
cd /d "%~dp0"

echo.
echo  ==============================================
echo   Integra - Vista previa de la pagina (con 3D)
echo  ==============================================
echo.
echo  Se abrira la pagina en: http://localhost:8080
echo  Para detener, cierra esta ventana.
echo.

rem Abre el navegador 2 segundos despues, cuando el servidor ya esta listo
start "" /min cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8080/index.html"

where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8080 --bind 127.0.0.1
  goto :fin
)

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8080 --bind 127.0.0.1
  goto :fin
)

where npx >nul 2>nul
if %errorlevel%==0 (
  npx --yes http-server -p 8080 -a 127.0.0.1 -c-1
  goto :fin
)

echo  No se encontro Python ni Node.js en esta computadora.
echo  Instala Python desde https://www.python.org/downloads/ y vuelve a intentar.
pause

:fin
