@echo off
setlocal enabledelayedexpansion

:: -----------------------------------------------
:: max_file_size.cmd
:: Finds the largest file in a given directory
:: Displays size in appropriate unit: B/KB/MB/GB/TB
:: -----------------------------------------------

set /p "TARGET_DIR=Enter directory path: "

if not exist "%TARGET_DIR%" (
    echo ERROR: Directory not found.
    pause
    exit /b 1
)

set MAX_SIZE=0
set MAX_FILE=

for /r "%TARGET_DIR%" %%F in (*) do (
    set "FSIZE=%%~zF"
    if !FSIZE! gtr !MAX_SIZE! (
        set MAX_SIZE=!FSIZE!
        set MAX_FILE=%%F
    )
)

if "%MAX_FILE%"=="" (
    echo No files found in "%TARGET_DIR%".
    echo.
    pause
    exit /b 0
)

:: --- Determine unit by digit count (avoids 32-bit overflow in set /a) ---
:: TB >= 13 digits, GB >= 10 digits, MB >= 7 digits, KB >= 4 digits
set SIZE=!MAX_SIZE!
set UNIT=B

set LEN=0
set TEMP=!SIZE!
:countloop
if "!TEMP!"=="" goto donecounting
set TEMP=!TEMP:~1!
set /a LEN+=1
goto countloop
:donecounting

if !LEN! geq 13 (
    set UNIT=TB
) else if !LEN! geq 10 (
    set UNIT=GB
) else if !LEN! geq 7 (
    set UNIT=MB
) else if !LEN! geq 4 (
    set UNIT=KB
)

:: --- Use PowerShell for safe floating point division ---
if "!UNIT!"=="B" (
    set DISPLAY=!SIZE! B
) else (
    for /f "delims=" %%R in ('powershell -nologo -noprofile -command ^
        "switch ('!UNIT!') { 'KB' {$d=1KB} 'MB' {$d=1MB} 'GB' {$d=1GB} 'TB' {$d=1TB} }; '{0:N2} !UNIT!' -f ([double]!SIZE! / $d)"') do (
        set DISPLAY=%%R
    )
)

echo.
echo  Largest File : !MAX_FILE!
echo  Size         : !DISPLAY!
echo.
pause
