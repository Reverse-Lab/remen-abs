@echo off
echo GitHub 저장소로 파일 복사 중...

REM 대상 폴더 설정 (GitHub Desktop으로 클론한 폴더 경로로 변경하세요)
REM 실제 경로로 수정하세요 (GitHub Desktop에서 "Show in Explorer" 클릭 후 경로 복사)
set TARGET_DIR=C:\Users\%USERNAME%\Documents\GitHub\remen-abs

REM 대상 폴더가 존재하는지 확인
if not exist "%TARGET_DIR%" (
    echo 오류: 대상 폴더가 존재하지 않습니다.
    echo GitHub Desktop으로 저장소를 클론한 후 다시 실행하세요.
    echo 클론된 폴더 경로를 TARGET_DIR 변수에 설정하세요.
    pause
    exit /b 1
)

echo 복사할 파일들:
echo - package.json
echo - package-lock.json
echo - README.md
echo - tsconfig.json
echo - tailwind.config.js
echo - postcss.config.js
echo - firebase.json
echo - .firebaserc
echo - env.example
echo - generate-pdf.js
echo - generate-premium-pdf.js
echo - BROCHURE_README.md
echo - FIREBASE_SETUP.md
echo - .gitignore
echo - .github/ 폴더
echo - public/ 폴더
echo - src/ 폴더

echo.
echo 복사 중...

REM 개별 파일 복사
copy package.json "%TARGET_DIR%\"
copy package-lock.json "%TARGET_DIR%\"
copy README.md "%TARGET_DIR%\"
copy tsconfig.json "%TARGET_DIR%\"
copy tailwind.config.js "%TARGET_DIR%\"
copy postcss.config.js "%TARGET_DIR%\"
copy firebase.json "%TARGET_DIR%\"
copy .firebaserc "%TARGET_DIR%\"
copy env.example "%TARGET_DIR%\"
copy generate-pdf.js "%TARGET_DIR%\"
copy generate-premium-pdf.js "%TARGET_DIR%\"
copy BROCHURE_README.md "%TARGET_DIR%\"
copy FIREBASE_SETUP.md "%TARGET_DIR%\"
copy .gitignore "%TARGET_DIR%\"

REM 폴더 복사
xcopy .github "%TARGET_DIR%\.github\" /E /I /Y
xcopy public "%TARGET_DIR%\public\" /E /I /Y
xcopy src "%TARGET_DIR%\src\" /E /I /Y

echo.
echo 복사 완료!
echo 이제 GitHub Desktop에서 변경사항을 확인하고 커밋하세요.
pause
