import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeSwitch: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!auth) {
      setError('Firebase Auth가 초기화되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // 사용자 친화적인 에러 메시지로 변환
      let userFriendlyMessage = '';
      
      if (error.code === 'auth/email-already-in-use') {
        userFriendlyMessage = '이미 가입된 이메일입니다. 로그인을 시도해주세요.';
      } else if (error.code === 'auth/user-not-found') {
        userFriendlyMessage = '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.';
      } else if (error.code === 'auth/wrong-password') {
        userFriendlyMessage = '비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
      } else if (error.code === 'auth/weak-password') {
        userFriendlyMessage = '비밀번호가 너무 약합니다. 6자리 이상으로 설정해주세요.';
      } else if (error.code === 'auth/invalid-email') {
        userFriendlyMessage = '올바른 이메일 형식을 입력해주세요.';
      } else if (error.code === 'auth/too-many-requests') {
        userFriendlyMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      } else {
        userFriendlyMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      }
      
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    if (!auth) {
      setError('Firebase Auth가 초기화되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error: any) {
      console.error('Google auth error:', error);
      
      // Google 로그인 에러 메시지 처리
      let userFriendlyMessage = '';
      
      if (error.code === 'auth/popup-closed-by-user') {
        userFriendlyMessage = '로그인 창이 닫혔습니다. 다시 시도해주세요.';
      } else if (error.code === 'auth/popup-blocked') {
        userFriendlyMessage = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        userFriendlyMessage = '로그인이 취소되었습니다. 다시 시도해주세요.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        userFriendlyMessage = '이미 다른 방법으로 가입된 계정입니다.';
      } else {
        userFriendlyMessage = 'Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      }
      
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    onModeSwitch(newMode);
    setError(''); // 에러 메시지 초기화
    setEmail(''); // 입력 필드 초기화
    setPassword('');
    setName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? '로그인' : '회원가입'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full mb-6 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 {mode === 'login' ? '로그인' : '회원가입'}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이메일을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {mode === 'login' ? '로그인 중...' : '회원가입 중...'}
                  </div>
                ) : (
                  mode === 'login' ? '로그인' : '회원가입'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {mode === 'login' ? '회원가입' : '로그인'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 