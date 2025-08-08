# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 만들기" 클릭
2. 프로젝트 이름: `remen-abs` 또는 원하는 이름
3. Google Analytics 활성화 (선택사항)
4. "프로젝트 만들기" 클릭

## 2. 웹 앱 추가

### 2.1 웹 앱 등록
1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임: `remen-abs-web`
3. "Firebase Hosting 설정" 체크 (선택사항)
4. "앱 등록" 클릭

### 2.2 설정 정보 복사
Firebase가 제공하는 설정 정보를 복사:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "remen-abs.firebaseapp.com",
  projectId: "remen-abs",
  storageBucket: "remen-abs.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## 3. 환경 변수 설정

### 3.1 .env 파일 생성
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=remen-abs.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=remen-abs
REACT_APP_FIREBASE_STORAGE_BUCKET=remen-abs.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### 3.2 실제 값으로 교체
위의 예시 값을 실제 Firebase 프로젝트에서 제공하는 값으로 교체하세요.

## 4. Firebase 서비스 활성화

### 4.1 Authentication 활성화
1. Firebase Console에서 "Authentication" 클릭
2. "시작하기" 클릭
3. "이메일/비밀번호" 제공업체 활성화
4. "저장" 클릭

### 4.2 Firestore Database 활성화
1. Firebase Console에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙: "테스트 모드에서 시작" 선택
4. 위치: `asia-northeast3 (서울)` 선택
5. "완료" 클릭

### 4.3 Storage 활성화
1. Firebase Console에서 "Storage" 클릭
2. "시작하기" 클릭
3. 보안 규칙: "테스트 모드에서 시작" 선택
4. 위치: `asia-northeast3 (서울)` 선택
5. "완료" 클릭

## 5. 보안 규칙 설정

### 5.1 Firestore 보안 규칙
Firestore Database > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 데이터
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 제품 데이터
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 문의 데이터
    match /inquiries/{inquiryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5.2 Storage 보안 규칙
Storage > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 6. 데이터베이스 구조

### 6.1 Firestore 컬렉션 구조

```
users/
  {userId}/
    name: string
    email: string
    phone: string
    createdAt: timestamp

products/
  {productId}/
    name: string
    brand: string
    model: string
    price: number
    description: string
    features: array
    imageUrl: string
    inStock: boolean
    createdAt: timestamp

inquiries/
  {inquiryId}/
    name: string
    email: string
    phone: string
    carBrand: string
    carModel: string
    message: string
    status: string
    createdAt: timestamp
```

## 7. 테스트

### 7.1 개발 서버 재시작
환경 변수를 설정한 후 개발 서버를 재시작:

```bash
npm start
```

### 7.2 Firebase 연결 확인
브라우저 콘솔에서 Firebase 연결 상태를 확인할 수 있습니다.

## 8. 배포 준비

### 8.1 프로덕션 환경 변수
배포 시에는 프로덕션용 Firebase 프로젝트를 사용하거나 
기존 프로젝트의 보안 규칙을 더 엄격하게 설정하세요.

### 8.2 환경 변수 관리
- 개발: `.env.development`
- 프로덕션: `.env.production`

## 주의사항

1. **API 키 보안**: `.env` 파일을 Git에 커밋하지 마세요
2. **보안 규칙**: 프로덕션 배포 전 보안 규칙을 검토하세요
3. **데이터 백업**: 중요한 데이터는 정기적으로 백업하세요
4. **모니터링**: Firebase Console에서 사용량과 오류를 모니터링하세요 