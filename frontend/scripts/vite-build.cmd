@echo off
set "ESBUILD_BINARY_PATH=%CD%\node_modules\esbuild\esbuild.exe"
node "%CD%\node_modules\vite\bin\vite.js" build
