import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase 설정 - 환경 변수에서만 가져오기
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// 환경 변수가 없으면 에러 발생
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase 설정 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Auth 초기화
export const auth = getAuth(app);

// Firestore 초기화
export const db = getFirestore(app);

// Storage 초기화
export const storage = getStorage(app);

// Analytics는 브라우저 환경에서만 초기화 (비동기)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development') {
  try {
    // Auth 에뮬레이터 연결 (포트 9099)
    // connectAuthEmulator(auth, 'http://localhost:9099');
    
    // Firestore 에뮬레이터 연결 (포트 8080)
    // connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Storage 에뮬레이터 연결 (포트 9199)
    // connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Emulator connection failed:', error);
  }
}

export default app; 