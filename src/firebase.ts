import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase 설정 - 환경 변수 또는 기본값 사용
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDA014dynTk9DEItafujRH0c1k0BPcF2NQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "remen-abs.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "remen-abs",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "remen-abs.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "520560736384",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:520560736384:web:5efdcf09721982425d8e65",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-L9D6YQQ5PX"
};

// Firebase 앱 초기화 (에러 처리 포함)
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // 기본 설정으로 재시도
  const fallbackConfig = {
    apiKey: "AIzaSyDA014dynTk9DEItafujRH0c1k0BPcF2NQ",
    authDomain: "remen-abs.firebaseapp.com",
    projectId: "remen-abs",
    storageBucket: "remen-abs.firebasestorage.app",
    messagingSenderId: "520560736384",
    appId: "1:520560736384:web:5efdcf09721982425d8e65",
    measurementId: "G-L9D6YQQ5PX"
  };
  app = initializeApp(fallbackConfig);
  console.log('Firebase app initialized with fallback config');
}

// Auth 초기화 (에러 처리 포함)
let auth;
try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase Auth initialization failed:', error);
  auth = null;
}

// Firestore 초기화 (에러 처리 포함)
let db;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firestore initialization failed:', error);
  db = null;
}

// Storage 초기화 (에러 처리 포함)
let storage;
try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Firebase Storage initialization failed:', error);
  storage = null;
}

// Analytics는 브라우저 환경에서만 초기화 (비동기)
let analytics = null;
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