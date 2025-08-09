# GitHub 배포 설정 가이드

## 1. GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가해야 합니다:

### Firebase 환경 변수
- `REACT_APP_FIREBASE_API_KEY`: Firebase API 키
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Firebase Auth 도메인
- `REACT_APP_FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Firebase Storage 버킷
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
- `REACT_APP_FIREBASE_APP_ID`: Firebase App ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Firebase Measurement ID

### Firebase Service Account
- `FIREBASE_SERVICE_ACCOUNT`: Firebase Service Account JSON 파일 내용

## 2. Firebase Service Account 생성

1. Firebase Console에서 프로젝트 설정으로 이동
2. Service accounts 탭 선택
3. "Generate new private key" 클릭
4. 다운로드된 JSON 파일의 내용을 `FIREBASE_SERVICE_ACCOUNT` secret에 추가

## 3. GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일이 자동으로 생성됩니다.

### 트리거 조건
- `main` 또는 `master` 브랜치에 push할 때
- `main` 또는 `master` 브랜치로 pull request가 생성될 때

### 배포 과정
1. Node.js 18 환경 설정
2. 의존성 설치 (`npm ci`)
3. 환경 변수 파일 생성
4. 프로젝트 빌드 (`npm run build`)
5. Firebase Hosting에 배포

## 4. 배포 확인

배포가 완료되면 다음 URL에서 확인할 수 있습니다:
- https://remen-abs.web.app

## 5. 문제 해결

### 빌드 실패
- GitHub Actions 로그에서 에러 확인
- 환경 변수가 올바르게 설정되었는지 확인
- Firebase Service Account 권한 확인

### 배포 실패
- Firebase 프로젝트 ID가 올바른지 확인
- Firebase Service Account JSON이 유효한지 확인
- Firebase 프로젝트에 Hosting이 활성화되어 있는지 확인

## 6. 로컬 개발

로컬에서 개발할 때는 `.env` 파일을 생성하여 환경 변수를 설정하세요:

```bash
# .env 파일 예시
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 7. 보안 주의사항

- `.env` 파일은 절대 GitHub에 커밋하지 마세요
- Firebase Service Account JSON은 안전하게 보관하세요
- GitHub Secrets는 저장소 관리자만 접근할 수 있도록 설정하세요

