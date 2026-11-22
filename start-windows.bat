@echo off
rem ============================================================
rem  Double-click this file to run the website on your computer.
rem  The first time, it installs Node.js and the website's parts.
rem  After that, it just starts the website.
rem ============================================================
setlocal
title Unfolding Letters
cd /d "%~dp0"

echo.
echo  ==========================================
echo    Unfolding Letters - getting ready...
echo  ==========================================
echo.

rem ---- 1. Make sure Node.js is installed ----
where node >nul 2>nul
if %errorlevel%==0 goto check_version

echo  Node.js is not installed yet. Installing it now (only needed once).
echo  If Windows asks "Do you want to allow this app to make changes?", click Yes.
echo.
where winget >nul 2>nul
if not %errorlevel%==0 goto manual_install

winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
rem Let this window find the new Node.js without restarting.
set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if not %errorlevel%==0 goto restart_needed

:check_version
rem ---- 2. Make sure Node.js is new enough (version 22 or higher) ----
for /f "tokens=1 delims=v." %%a in ('node -v') do set NODE_MAJOR=%%a
if %NODE_MAJOR% LSS 22 goto too_old
for /f %%v in ('node -v') do echo  Node.js %%v is installed.
echo.

rem ---- 3. Install / update the website's parts ----
echo  Checking the website's parts (the first time takes a minute or two)...
call npm install --no-audit --no-fund
if not %errorlevel%==0 goto npm_failed
echo.

rem ---- 4. Start the website ----
echo  ==========================================
echo    The website will open in your browser.
echo    Keep this window open while you use it.
echo    To stop the website, close this window.
echo  ==========================================
echo.
call npm start
goto end

:too_old
echo  Your Node.js is too old. Updating it now...
where winget >nul 2>nul
if not %errorlevel%==0 goto manual_install
winget upgrade --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
goto restart_needed

:restart_needed
echo.
echo  Node.js was installed. Please close this window and
echo  double-click start-windows.bat again.
goto end

:manual_install
echo  Could not install Node.js automatically.
echo  1. Your browser will open the Node.js website.
echo  2. Download the "LTS" version and install it (just click Next).
echo  3. Then double-click start-windows.bat again.
start "" "https://nodejs.org/en/download"
goto end

:npm_failed
echo.
echo  Something went wrong while installing the website's parts.
echo  Check your internet connection, then try again.
echo  If it still fails, send a photo of this window to whoever set this up.
goto end

:end
echo.
pause
