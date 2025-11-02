@echo off
REM React Starter Kit - Windows Batch Script
REM Interactive menu for navigating through iterations

echo ================================================
echo   JavaScript + React Starter Kit (Windows)
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

node --version
npm --version
echo.

:menu
echo ================================================
echo   Choose an action:
echo ================================================
echo.
echo   JavaScript Basics:
echo   [0] Test Environment (Run hello-world.js)
echo   [1] JavaScript Basics
echo   [2] Control Structures
echo   [3] Functions and DOM
echo   [4] ES6 Features
echo.
echo   React Applications:
echo   [5] Setup React App (Iteration 5)
echo   [6] React Components (Iteration 6)
echo   [7] Props and State (Iteration 7)
echo   [8] Events and Lists (Iteration 8)
echo   [9] Fetch API (Iteration 9)
echo   [10] Mini Project (Iteration 10)
echo.
echo   Other:
echo   [help] Show getting started guide
echo   [exit] Exit
echo.
set /p choice="Enter your choice: "

if "%choice%"=="0" goto iter0
if "%choice%"=="1" goto iter1
if "%choice%"=="2" goto iter2
if "%choice%"=="3" goto iter3
if "%choice%"=="4" goto iter4
if "%choice%"=="5" goto iter5
if "%choice%"=="help" goto help
if "%choice%"=="exit" goto end
echo.
echo [ERROR] Invalid choice. Please try again.
echo.
pause
cls
goto menu

:iter0
echo.
echo Running: 00-environment-setup\hello-world.js
echo ================================================
node 00-environment-setup\hello-world.js
echo ================================================
echo.
pause
cls
goto menu

:iter1
echo.
echo Iteration 1: JavaScript Basics
echo.
echo Running: variables.js
echo ================================================
node 01-js-basics\variables.js
echo ================================================
echo.
echo Running: operators.js
echo ================================================
node 01-js-basics\operators.js
echo ================================================
echo.
pause
cls
goto menu

:iter2
echo.
echo Iteration 2: Control Structures
echo.
echo Running: if-else.js
echo ================================================
node 02-control-structures\if-else.js
echo ================================================
echo.
pause
cls
goto menu

:iter3
echo.
echo Iteration 3: Functions and DOM
echo.
echo Running: functions.js
echo ================================================
node 03-functions-and-dom\functions.js
echo ================================================
echo.
echo To see DOM examples, open 03-functions-and-dom\index.html in a browser
echo.
pause
cls
goto menu

:iter4
echo.
echo Iteration 4: ES6 Features
echo.
echo Running: arrow-functions.js
echo ================================================
node 04-es6-features\arrow-functions.js
echo ================================================
echo.
pause
cls
goto menu

:iter5
echo.
echo Iteration 5: React Setup
echo.
echo To create a React app:
echo   cd 05-react-setup
echo   npm create vite@latest my-first-react-app -- --template react
echo   cd my-first-react-app
echo   npm install
echo   npm run dev
echo.
pause
cls
goto menu

:help
cls
type GETTING_STARTED.md
echo.
pause
cls
goto menu

:end
echo.
echo Happy coding! Keep learning!
echo.
exit /b 0
