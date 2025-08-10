import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase 설정 - 환경 변수만 사용 (보안 강화)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

// 환경 변수 검증 (더 관대한 검증)
const missingVars = [];
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.trim() === '') {
  missingVars.push('REACT_APP_FIREBASE_API_KEY');
}
if (!firebaseConfig.projectId || firebaseConfig.projectId.trim() === '') {
  missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
}
if (!firebaseConfig.authDomain || firebaseConfig.authDomain.trim() === '') {
  missingVars.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
}

// 환경변수 문제가 있어도 앱이 중단되지 않도록 수정
if (missingVars.length > 0) {
  const errorMsg = `Firebase 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}. .env 파일을 확인해주세요.`;
  console.error(errorMsg);
  
  // 프로덕션에서도 에러를 throw하지 않고 경고만 표시
  if (process.env.NODE_ENV === 'production') {
    console.warn('프로덕션 환경에서 Firebase 환경변수가 누락되었습니다. 일부 기능이 제한될 수 있습니다.');
  } else {
    console.warn('개발 환경에서는 Firebase 기능이 제한될 수 있습니다.');
  }
}

// Firebase 앱 초기화 (에러가 발생해도 계속 진행)
let app: FirebaseApp | null = null;
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    console.warn('Firebase 환경변수가 부족하여 앱을 초기화할 수 없습니다.');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // 에러가 발생해도 앱이 중단되지 않도록 null로 설정
  app = null;
}

// Auth 초기화
let auth: Auth | null = null;
try {
  if (app) {
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  }
} catch (error) {
  console.error('Firebase Auth initialization failed:', error);
}

// Firestore 초기화
let db: Firestore | null = null;
try {
  if (app) {
    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  }
} catch (error) {
  console.error('Firestore initialization failed:', error);
}

// Storage 초기화
let storage: FirebaseStorage | null = null;
try {
  if (app) {
    storage = getStorage(app);
    console.log('Firebase Storage initialized successfully');
  }
} catch (error) {
  console.error('Firebase Storage initialization failed:', error);
}

// Analytics는 브라우저 환경에서만 초기화 (비동기)
let analytics: Analytics | null = null;
if (app) {
  isSupported().then(yes => {
    if (yes && app) {  // app이 여전히 존재하는지 다시 확인
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
}

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development' && app) {
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