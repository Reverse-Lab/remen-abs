# GitHub Actions Firebase 배포 설정 가이드

## 🔍 문제 상황
GitHub Actions에서 빌드할 때 Firebase 환경변수가 없어서 앱이 시작 직후 에러를 throw하고 있습니다.
- 로컬에서는 `.env` 파일이 있어서 정상 빌드
- GitHub Actions 서버에는 환경변수가 없어서 빌드 실패
- 배포된 앱에서 하얀 화면 (초기화 실패) 표시

**증상:** 번들에서 `apiKey: ""`로 비어있음 → "REACT_APP_FIREBASE_API_KEY가 없음" 에러

## 🛠️ 해결 방법

### 1단계: GitHub Secrets 설정 확인

**GitHub 리포지토리 → Settings → Secrets and variables → Actions**에서 다음 환경변수들이 **실제로 설정되어 있는지** 확인:

```
REACT_APP_FIREBASE_API_KEY          ← 가장 중요!
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID (선택사항)
```

**주의사항:**
- 오타나 공백이 없어야 함
- 값이 실제로 입력되어 있어야 함 (빈 값이면 안됨)
- `REACT_APP_` 접두사는 필수

### 2단계: 환경변수 테스트

1. **Actions 탭에서 "Test Environment Variables" 워크플로 실행**
   - 수동으로 실행하여 환경변수 설정 상태 확인
   - 각 변수가 올바르게 설정되었는지 검증

2. **테스트 결과 확인**
   - ✅ 표시: 정상 설정
   - ❌ 표시: 설정되지 않음
   - ⚠️ 표시: 선택사항 (설정 안해도 됨)

### 3단계: Firebase 프로젝트 설정 값 확인

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

### 4단계: GitHub Secrets 설정

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

### 5단계: GitHub Actions 워크플로 확인

현재 워크플로 (`.github/workflows/firebase-deploy.yml`)는 이미 올바르게 설정되어 있습니다:

- ✅ `.env.production` 파일 자동 생성
- ✅ Firebase 환경변수 검증 (빈 값 체크)
- ✅ 빌드 및 배포 자동화
- ✅ 환경변수가 없으면 빌드 중단

### 6단계: 배포 테스트

1. **main 브랜치에 push**
   ```bash
   git add .
   git commit -m "Update GitHub Actions workflow with environment variable validation"
   git push origin main
   ```

2. **GitHub Actions 실행 확인**
   - Actions 탭에서 워크플로 실행 상태 확인
   - 빌드 로그에서 환경변수 설정 확인
   - 환경변수 검증 단계에서 성공/실패 확인

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

- [ ] GitHub Secrets에 모든 필수 환경변수 추가
- [ ] "Test Environment Variables" 워크플로로 환경변수 설정 상태 확인
- [ ] main 브랜치에 push하여 배포 테스트
- [ ] GitHub Actions 로그에서 환경변수 검증 성공 확인
- [ ] 배포된 앱에서 정상 작동 확인
- [ ] 개발자 도구 콘솔에서 에러 메시지 없음 확인

## 🚨 주의사항

1. **보안**: GitHub Secrets는 암호화되어 저장되며, 로그에 노출되지 않습니다
2. **환경변수명**: `REACT_APP_` 접두사는 Create React App에서 필수입니다
3. **빌드 최적화**: 프로덕션 빌드에서 소스맵 생성 비활성화
4. **에러 처리**: 환경변수가 없으면 빌드 단계에서 실패하도록 설정
5. **값 검증**: 빈 값이나 설정되지 않은 환경변수가 있으면 빌드가 중단됩니다

## 🔍 문제 해결

### 여전히 에러가 발생하는 경우:

1. **GitHub Secrets 값 확인**
   - Settings → Secrets and variables → Actions에서 각 변수 확인
   - 값이 실제로 입력되어 있는지 확인 (빈 값이면 안됨)

2. **환경변수 테스트 실행**
   - Actions 탭에서 "Test Environment Variables" 워크플로 수동 실행
   - 각 변수의 설정 상태 확인

3. **워크플로 로그 확인**
   - Actions 탭에서 빌드 로그 상세 확인
   - 환경변수 검증 단계에서 실패 원인 파악

4. **Firebase 설정 재확인**
   - Firebase Console에서 프로젝트 설정 값들 재확인
   - 프로젝트 ID와 설정 값들이 일치하는지 확인

### 일반적인 문제들:

- **환경변수명 오타**: `REACT_APP_FIREBASE_API_KEY` (정확한 철자 확인)
- **빈 값**: GitHub Secrets에 값이 실제로 입력되어 있어야 함
- **권한 문제**: 리포지토리 Settings에 접근 권한 확인

## 📞 지원

문제가 지속되는 경우:
1. GitHub Actions 워크플로 로그 확인
2. "Test Environment Variables" 워크플로 실행 결과 확인
3. Firebase Console에서 프로젝트 설정 재확인
4. 환경변수 값들의 정확성 검증
