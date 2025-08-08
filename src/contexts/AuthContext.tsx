import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 타임아웃 설정 (5초 후 로딩 완료)
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      
      if (user) {
        try {
          // Firestore 연결 타임아웃 설정
          const profilePromise = getDoc(doc(db, 'users', user.uid));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore timeout')), 3000)
          );
          
          const userDoc = await Promise.race([profilePromise, timeoutPromise]) as any;
          
          if (userDoc.exists()) {
            console.log('User profile exists:', userDoc.data());
            const profileData = userDoc.data() as UserProfile;
            setUserProfile(profileData);
          } else {
            console.log('User profile does not exist, creating new profile...');
            try {
              // users 컬렉션의 문서 개수 확인
              const usersSnapshot = await getDocs(collection(db, 'users'));
              const isFirstUser = usersSnapshot.empty;
              console.log('Is first user:', isFirstUser);
              
              const defaultProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                name: user.displayName || '',
                role: isFirstUser ? 'admin' : 'user',
                createdAt: new Date()
              };
              console.log('Creating profile:', defaultProfile);
              
              // Firestore에 저장
              await setDoc(doc(db, 'users', user.uid), defaultProfile);
              console.log('Profile saved to Firestore successfully');
              setUserProfile(defaultProfile);
            } catch (profileError) {
              console.error('Error creating user profile:', profileError);
              // 프로필 생성 실패해도 로딩은 완료
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Firestore 연결 실패해도 로딩은 완료
        }
      } else {
        setUserProfile(null);
      }
      
      clearTimeout(timeoutId);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 