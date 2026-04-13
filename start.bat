@echo off
title Gorev 10 - Gorsel Onizleme
echo.
echo  ====================================
echo   Gorev 10 - Gorsel Onizleme Sayfasi
echo  ====================================
echo.

cd /d "%~dp0"

:: Node.js kontrol
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Node.js bulunamadi! https://nodejs.org adresinden yukleyin.
    pause
    exit /b 1
)

:: node_modules kontrol
if not exist "node_modules" (
    echo [*] Paketler yukleniyor... (ilk seferde biraz bekleyin)
    call npm install
    echo.
)

:: .next cache temizle (eski surec sorunlarini onler)
if exist ".next\dev" (
    rmdir /s /q ".next" >nul 2>&1
)

:: Bos port bul (3000'den baslayarak)
set PORT=3000
:findport
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    set /a PORT+=1
    if %PORT% gtr 3010 (
        echo [HATA] 3000-3010 arasinda bos port bulunamadi!
        pause
        exit /b 1
    )
    goto findport
)

echo [*] Port %PORT% kullaniliyor...
echo [*] Tarayici aciliyor: http://localhost:%PORT%/preview
echo.
echo    Kapatmak icin bu pencereyi kapatin veya Ctrl+C basin.
echo.

:: 3 saniye sonra tarayiciyi ac
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:%PORT%/preview"

:: Dev server baslat
call npx next dev -p %PORT%
