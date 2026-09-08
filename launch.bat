@echo off
title TRIMOBE & UMSP - Manuels de Therapeutique Clinique 2026
echo =========================================================================
echo   COLLECTION TRIMOBE & UMSP - MANUELS DE THERAPEUTIQUE CLINIQUE 2026
echo   Medecine Generale & Geriatrie - Plateforme Web Medicale
echo =========================================================================
echo.
echo Demarrage du serveur local sur http://localhost:8080 ...
start http://localhost:8080
python -m http.server 8080
pause
