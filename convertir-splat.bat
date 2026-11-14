@echo off
chcp 65001 >nul
title Integra - Convertir splat a formato web
cd /d "%~dp0"
set "PYTHONIOENCODING=utf-8"

echo.
echo  ===================================================
echo   Integra - Convertidor de Gaussian Splat para la web
echo  ===================================================

if "%~1"=="" (
  echo.
  echo  Arrastra tu archivo .ply y sueltalo ENCIMA de este archivo
  echo  ^(convertir-splat.bat^). El resultado se guarda en la carpeta models\
  echo.
  pause
  exit /b
)

set "PY="
where python >nul 2>nul && set "PY=python"
if not defined PY ( where py >nul 2>nul && set "PY=py" )
if not defined PY (
  echo.
  echo  No se encontro Python en esta computadora.
  echo  Instala Python desde https://www.python.org/downloads/ y vuelve a intentar.
  echo.
  pause
  exit /b 1
)

:siguiente
if "%~1"=="" goto :fin
if /i not "%~x1"==".ply" (
  echo.
  echo  "%~nx1" no es un archivo .ply. Se omite.
) else (
  %PY% "%~dp0herramientas\ply2splat.py" "%~f1"
)
shift
goto :siguiente

:fin
echo  Cuando termines, haz push para publicarlo.
echo.
pause
