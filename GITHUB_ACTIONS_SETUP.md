# GitHub Actions Firebase 배포 설정 가이드

## 🔍 문제 상황
GitHub Actions에서 빌드할 때 Firebase 환경변수가 없어서 앱이 시작 직후 에러를 throw하고 있습니다.
- 로컬에서는 `.env` 파일이 있어서 정상 빌드
- GitHub Actions 서버에는 환경변수가 없어서 빌드 실패
- 배포된 앱에서 하얀 화면 (초기화 실패) 표시

## 🛠️ 해결 방법

### 1단계: Firebase 프로젝트 설정 값 확인

1. **Firebase Console 접속**
   - https://console.firebase.google.com/
   - `remen-abs` 프로젝트 선택

2. **프로젝트 설정 → 일반**
   - 웹 앱 섹션에서 설정 값들을 복사
   - 또는 기존 웹 앱의 설정 확인

3. **필요한 환경변수들:**
   ```
   REACT_APP_FIREBASE_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   REACT_APP_FIREBASE_APP_ID
   REACT_APP_FIREBASE_MEASUREMENT_ID (선택사항)
   ```

### 2단계: GitHub Secrets 설정

1. **GitHub 리포지토리 접속**
   - `remen-abs` 리포지토리로 이동

2. **Settings → Secrets and variables → Actions**
   - "New repository secret" 버튼 클릭

3. **각 환경변수 추가:**
   ```
   Name: REACT_APP_FIREBASE_API_KEY
   Value: [Firebase Console에서 복사한 API Key]
   
   Name: REACT_APP_FIREBASE_AUTH_DOMAIN
   Value: [Firebase Console에서 복사한 Auth Domain]
   
   Name: REACT_APP_FIREBASE_PROJECT_ID
   Value: remen-abs
   
   Name: REACT_APP_FIREBASE_STORAGE_BUCKET
   Value: [Firebase Console에서 복사한 Storage Bucket]
   
   Name: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   Value: [Firebase Console에서 복사한 Messaging Sender ID]
   
   Name: REACT_APP_FIREBASE_APP_ID
   Value: [Firebase Console에서 복사한 App ID]
   
   Name: REACT_APP_FIREBASE_MEASUREMENT_ID
   Value: [Firebase Console에서 복사한 Measurement ID] (선택사항)
   ```

### 3단계: GitHub Actions 워크플로 확인

현재 워크플로 (`.github/workflows/firebase-deploy.yml`)는 이미 올바르게 설정되어 있습니다:

- ✅ `.env.production` 파일 자동 생성
- ✅ Firebase 환경변수 검증
- ✅ 빌드 및 배포 자동화

### 4단계: 배포 테스트

1. **main 브랜치에 push**
   ```bash
   git add .
   git commit -m "Update GitHub Actions workflow"
   git push origin main
   ```

2. **GitHub Actions 실행 확인**
   - Actions 탭에서 워크플로 실행 상태 확인
   - 빌드 로그에서 환경변수 설정 확인

3. **배포 결과 확인**
   - https://remen-abs.web.app 접속
   - 개발자 도구 콘솔에서 에러 메시지 확인

## 🔧 환경변수 값 찾는 방법

### Firebase Console에서:
1. **프로젝트 설정 → 일반**
2. **웹 앱** 섹션에서 설정 값들 확인
3. **Firebase SDK snippet** 복사하여 사용

### 또는 기존 .env 파일에서:
로컬 개발 환경의 `.env` 파일에서 값들을 복사하여 GitHub Secrets에 설정

## 📋 체크리스트

- [ ] Firebase Console에서 설정 값들 확인
- [ ] GitHub Secrets에 모든 환경변수 추가
- [ ] main 브랜치에 push하여 배포 테스트
- [ ] 배포된 앱에서 정상 작동 확인
- [ ] 개발자 도구 콘솔에서 에러 메시지 없음 확인

## 🚨 주의사항

1. **보안**: GitHub Secrets는 암호화되어 저장되며, 로그에 노출되지 않습니다
2. **환경변수명**: `REACT_APP_` 접두사는 Create React App에서 필수입니다
3. **빌드 최적화**: 프로덕션 빌드에서 소스맵 생성 비활성화
4. **에러 처리**: 환경변수가 없으면 빌드 단계에서 실패하도록 설정

## 🔍 문제 해결

### 여전히 에러가 발생하는 경우:
1. **GitHub Secrets 값 확인**: 올바른 값이 설정되었는지 확인
2. **워크플로 로그 확인**: Actions 탭에서 빌드 로그 상세 확인
3. **환경변수 검증**: `.env.production` 파일 생성 단계에서 로그 확인
4. **Firebase 설정**: 프로젝트 ID와 설정 값들이 일치하는지 확인

## 📞 지원

문제가 지속되는 경우:
1. GitHub Actions 워크플로 로그 확인
2. Firebase Console에서 프로젝트 설정 재확인
3. 환경변수 값들의 정확성 검증
