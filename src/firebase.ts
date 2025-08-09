import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase 설정 - 환경 변수만 사용 (보안 강화)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// 환경 변수 검증
const missingVars = [];
if (!firebaseConfig.apiKey) missingVars.push('REACT_APP_FIREBASE_API_KEY');
if (!firebaseConfig.projectId) missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
if (!firebaseConfig.authDomain) missingVars.push('REACT_APP_FIREBASE_AUTH_DOMAIN');

if (missingVars.length > 0) {
  const errorMsg = `Firebase 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}. .env 파일을 확인해주세요.`;
  console.error(errorMsg);
  
  // 프로덕션 빌드에서는 오류 발생 (GitHub Actions 배포 시)
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg);
  }
  
  // 개발 환경에서는 경고만 표시하고 계속 진행
  console.warn('개발 환경에서는 Firebase 기능이 제한될 수 있습니다.');
}

// Firebase 앱 초기화
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw error;
}

// Auth 초기화
let auth: Auth | null = null;
try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase Auth initialization failed:', error);
}

// Firestore 초기화
let db: Firestore | null = null;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firestore initialization failed:', error);
}

// Storage 초기화
let storage: FirebaseStorage | null = null;
try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Firebase Storage initialization failed:', error);
}

// Analytics는 브라우저 환경에서만 초기화 (비동기)
let analytics: Analytics | null = null;
isSupported().then(yes => {
  if (yes) {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } catch (error) {
      console.error('Firebase Analytics initialization failed:', error);
    }
  }
}).catch(error => {
  console.error('Firebase Analytics support check failed:', error);
});

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development') {
  try {
    // Auth 에뮬레이터 연결 (포트 9099)
    // if (auth) connectAuthEmulator(auth, 'http://localhost:9099');
    
    // Firestore 에뮬레이터 연결 (포트 8080)
    // if (db) connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Storage 에뮬레이터 연결 (포트 9199)
    // if (storage) connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Emulator connection failed:', error);
  }
}

export { auth, db, storage, analytics };
export default app; 