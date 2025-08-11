# REMEN_ABS 게스트 장바구니 시스템 구현 가이드

## 개요

이 문서는 REMEN_ABS 프로젝트에 Firebase Cloud Functions를 활용한 게스트 장바구니 시스템을 구현하는 방법을 설명합니다.

## 구현된 기능

### 1. 게스트 장바구니 관리
- **쿠키 기반 장바구니 ID**: 첫 방문 시 UUID 생성, 30일 유지
- **Firestore 저장**: `carts/{cartId}` 컬렉션에 장바구니 데이터 저장
- **Cloud Functions API**: 클라이언트는 직접 Firestore에 접근하지 않고 함수 API만 사용

### 2. 보안
- **Firestore 보안 규칙**: `carts` 컬렉션에 대한 직접 접근 차단
- **API 기반 접근**: 모든 장바구니 작업은 Cloud Functions를 통해서만 수행

### 3. 사용자 경험
- **로그인 시 병합**: 게스트 장바구니와 사용자 장바구니 자동 병합
- **실시간 동기화**: 장바구니 변경사항 즉시 반영
- **로딩 상태**: 사용자 피드백을 위한 로딩 및 에러 상태 표시

## 아키텍처

```
클라이언트 (React) → Cloud Functions → Firestore
     ↓                    ↓           ↓
  쿠키 저장          보안/검증      데이터 저장
  (cartId)          (API)        (carts/{cartId})
```

## 파일 구조

```
src/
├── services/
│   └── cartService.ts          # 장바구니 API 서비스
├── contexts/
│   └── CartContext.tsx         # 장바구니 상태 관리
└── pages/
    └── Cart.tsx                # 장바구니 페이지

functions/
├── src/
│   └── index.ts                # Cloud Functions
├── package.json
├── tsconfig.json
├── .firebaserc                  # Functions 프로젝트 설정
└── firebase.json                # Functions 설정

firebase.json                    # 메인 Firebase 설정
firestore.rules                  # 보안 규칙
firestore.indexes.json           # Firestore 인덱스
```

## Firebase Functions 설정

### 1. 필수 설정 파일들

#### functions/.firebaserc
```json
{
  "projects": {
    "default": "remen-abs"
  }
}
```

#### functions/firebase.json
```json
{
  "functions": {
    "source": ".",
    "runtime": "nodejs18"
  }
}
```

#### functions/package.json
```json
{
  "scripts": {
    "build": "tsc",
    "deploy": "firebase deploy --only functions",
    "predeploy": "npm run build"
  },
  "engines": {
    "node": "18"
  }
}
```

### 2. 환경 변수 설정

Firebase Console에서 다음 환경 변수를 설정해야 합니다:

- `PROJECT_ID`: remen-abs
- `REGION`: asia-northeast3 (권장)
- `ALLOWED_ORIGIN`: https://remen-abs.web.app

## 배포 단계

### 1. 로컬에서 Functions 배포

```bash
# functions 디렉토리로 이동
cd functions

# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# Firebase Functions 배포
firebase deploy --only functions
```

### 2. Firestore 보안 규칙 배포

```bash
# 프로젝트 루트에서
firebase deploy --only firestore:rules
```

### 3. 전체 배포 (권장)

```bash
# 모든 리소스 배포
firebase deploy
```

### 4. GitHub Actions를 통한 자동 배포

GitHub Secrets에 다음을 추가해야 합니다:

- `FIREBASE_TOKEN`: Firebase CLI 토큰

토큰 생성 방법:
```bash
firebase login:ci
```

## API 엔드포인트

### 장바구니 관리
- `POST /api/getCart` - 장바구니 조회
- `POST /api/addItem` - 상품 추가
- `POST /api/updateItem` - 상품 수정
- `POST /api/removeItem` - 상품 제거
- `POST /api/clearCart` - 장바구니 비우기

### 사용자 관리
- `POST /api/mergeCartOnSignIn` - 로그인 시 장바구니 병합

## 데이터 모델

### Firestore 문서 구조
```typescript
carts/{cartId} {
  createdAt: Timestamp,        // 생성 시간
  updatedAt: Timestamp,        // 수정 시간
  userId: string | null,       // 사용자 ID (로그인 시)
  items: [
    {
      sku: string,             // 상품 SKU
      qty: number,             // 수량
      priceAtAdd: number,      // 추가 시 가격
      name: string,            // 상품명
      brand: string,           // 브랜드
      model: string,           // 모델
      imageUrl: string,        // 이미지 URL
      inStock: boolean,        // 재고 상태
      checked: boolean         // 선택 상태
    }
  ]
}
```

## 사용법

### 1. 장바구니에 상품 추가
```typescript
import { useCart } from '../contexts/CartContext';

const { addToCart } = useCart();

await addToCart({
  id: 'product-123',
  sku: 'product-123',
  name: 'ABS 모듈',
  brand: '렉서스',
  model: 'RX350',
  price: 150000,
  imageUrl: '/images/abs-module.jpg',
  inStock: true
});
```

### 2. 장바구니 상태 확인
```typescript
const { state } = useCart();

console.log('총 상품 수:', state.totalItems);
console.log('총 금액:', state.totalPrice);
console.log('상품 목록:', state.items);
```

### 3. 수량 변경
```typescript
const { updateQuantity } = useCart();

await updateQuantity('product-123', 2);
```

## 자동 정리

- **만료 카트 정리**: 45일 이상 업데이트되지 않은 게스트 카트 자동 삭제
- **스케줄러**: 24시간마다 실행

## 보안 고려사항

1. **직접 접근 차단**: Firestore 보안 규칙으로 `carts` 컬렉션 직접 접근 차단
2. **API 검증**: Cloud Functions에서 모든 입력 데이터 검증
3. **CORS 설정**: 허용된 도메인에서만 API 호출 가능
4. **쿠키 보안**: `Secure`, `SameSite=Lax` 설정으로 보안 강화

## 모니터링

### Cloud Functions 로그
```bash
firebase functions:log
```

### Firestore 사용량 모니터링
- Firebase Console에서 Firestore 사용량 확인
- 읽기/쓰기 작업 수 모니터링

## 문제 해결

### 일반적인 문제들

1. **CORS 오류**
   - `firebase.json`의 `rewrites` 설정 확인
   - Cloud Functions의 CORS 헤더 설정 확인

2. **장바구니 로드 실패**
   - Firestore 보안 규칙 확인
   - Cloud Functions 배포 상태 확인

3. **쿠키 문제**
   - HTTPS 환경에서만 작동 (Secure 플래그)
   - 도메인 설정 확인

4. **Functions 배포 실패**
   - Node.js 버전 확인 (18 이상 필요)
   - Firebase CLI 로그인 상태 확인
   - 프로젝트 ID 설정 확인

### 디버깅 팁

1. **브라우저 개발자 도구**
   - Network 탭에서 API 호출 확인
   - Application 탭에서 쿠키 상태 확인

2. **Firebase Console**
   - Functions 로그 확인
   - Firestore 데이터 확인

3. **로컬 테스트**
   ```bash
   cd functions
   npm run serve
   ```

## 성능 최적화

1. **배치 처리**: 여러 상품 동시 추가 시 배치 처리
2. **캐싱**: 자주 사용되는 상품 정보 캐싱
3. **지연 로딩**: 필요할 때만 장바구니 데이터 로드

## 향후 개선 사항

1. **실시간 동기화**: Firestore 실시간 리스너 활용
2. **오프라인 지원**: Service Worker를 통한 오프라인 장바구니
3. **다국어 지원**: 국제화 (i18n) 지원
4. **알림 시스템**: 장바구니 변경 시 푸시 알림

## 지원 및 문의

구현 과정에서 문제가 발생하거나 추가 기능이 필요한 경우, 개발팀에 문의하세요.

---

**참고**: 이 시스템은 Firebase의 무료 플랜에서도 작동하지만, 프로덕션 환경에서는 적절한 플랜을 선택하는 것을 권장합니다.
