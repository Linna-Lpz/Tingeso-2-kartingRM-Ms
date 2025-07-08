@echo off
REM Script para ejecutar análisis SonarQube en Windows
REM Uso: run-sonar.bat "tu_token_aqui"

if "%~1"=="" (
    echo ❌ Error: Token requerido
    echo Uso: run-sonar.bat "tu_token_aqui"
    echo.
    echo Para obtener un token:
    echo 1. Ve a http://localhost:9000
    echo 2. Login como admin
    echo 3. Ve a User ^> My Account ^> Security
    echo 4. Genera un nuevo token
    exit /b 1
)

set SONAR_TOKEN=%~1
set SONAR_URL=http://localhost:9000

echo 🔍 Iniciando análisis de SonarQube...
echo 📊 Proyecto: karting2Frontend
echo 🌐 Servidor: %SONAR_URL%

REM Verificar que SonarQube esté corriendo
echo 🔧 Verificando conexión a SonarQube...
curl -s %SONAR_URL% > nul
if errorlevel 1 (
    echo ❌ Error: No se puede conectar a SonarQube en %SONAR_URL%
    echo    Asegúrate de que SonarQube esté ejecutándose
    exit /b 1
)
echo ✅ SonarQube está corriendo

REM Generar reporte de ESLint
echo 🔨 Generando reporte de ESLint...
call npm run lint:report
if errorlevel 1 (
    echo ⚠️  ESLint encontró problemas, pero continuando con el análisis...
)

REM Verificar sonar-scanner
echo 🔧 Verificando SonarQube Scanner...
where sonar-scanner > nul 2>&1
if errorlevel 1 (
    echo ❌ Error: sonar-scanner no está instalado
    echo 📥 Opciones de instalación:
    echo    1. Descargar desde: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
    echo    2. Con npm: npm install -g sonar-scanner
    echo    3. Con chocolatey: choco install sonarscanner-msbuild-net46
    exit /b 1
)

REM Ejecutar análisis SonarQube
echo 🚀 Ejecutando análisis SonarQube...
sonar-scanner -Dsonar.login=%SONAR_TOKEN%

if errorlevel 0 (
    echo ✅ Análisis completado exitosamente!
    echo 🌐 Ver resultados en: %SONAR_URL%/dashboard?id=karting2Frontend
) else (
    echo ❌ Error durante el análisis SonarQube
    exit /b 1
)
