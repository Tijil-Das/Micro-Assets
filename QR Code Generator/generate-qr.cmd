@echo off
setlocal
title QR Code Generator CLI - Micro-Assets

:: Navigate to script directory
cd /d "%~dp0"

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found on your system PATH.
    echo Please install Python 3 from https://www.python.org/ or the Microsoft Store.
    echo.
    pause
    exit /b 1
)

:: Run generator
python qr_generator.py %*

if %errorlevel% neq 0 (
    echo.
    echo [FAILED] Generation exited with error code %errorlevel%.
    pause
    exit /b %errorlevel%
)

:: If run interactively via double-click (no arguments provided), pause so window doesn't close
if "%~1"=="" (
    pause
)
