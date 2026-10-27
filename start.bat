@echo off
cd /d "%~dp0"
echo.
echo   星際工坊 · Three.js 互動學院
echo   正在啟動本機伺服器...
echo.
start "Star Forge Server" /min cmd /c "node serve.mjs"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8137
echo   已開啟 http://127.0.0.1:8137
echo   關閉最小化的「Star Forge Server」視窗即可停止伺服器。
echo.
pause
