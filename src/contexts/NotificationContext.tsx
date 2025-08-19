import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { inquiryService } from '../services/firebaseService';

interface NotificationContextType {
  answeredInquiriesCount: number;
  unreadAnsweredCount: number;
  refreshNotifications: () => void;
  markAnswerAsRead: (inquiryId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [answeredInquiriesCount, setAnsweredInquiriesCount] = useState(0);
  const [unreadAnsweredCount, setUnreadAnsweredCount] = useState(0);
  const { user } = useAuth();

  const loadAnsweredInquiriesCount = async () => {
    if (user) {
      try {
        const answeredCount = await inquiryService.getAnsweredInquiriesCount(user.uid);
        const unreadCount = await inquiryService.getUnreadAnsweredCount(user.uid);
        setAnsweredInquiriesCount(answeredCount);
        setUnreadAnsweredCount(unreadCount);
      } catch (error) {
        console.error('Error loading answered inquiries count:', error);
      }
    } else {
      setAnsweredInquiriesCount(0);
      setUnreadAnsweredCount(0);
    }
  };

  const refreshNotifications = () => {
    loadAnsweredInquiriesCount();
  };

  const markAnswerAsRead = async (inquiryId: string) => {
    if (user) {
      try {
        await inquiryService.markAnswerAsRead(inquiryId);
        // 답변 확인 후 미확인 개수 새로고침
        const unreadCount = await inquiryService.getUnreadAnsweredCount(user.uid);
        setUnreadAnsweredCount(unreadCount);
      } catch (error) {
        console.error('Error marking answer as read:', error);
      }
    }
  };

  useEffect(() => {
    loadAnsweredInquiriesCount();
  }, [user]);

  const value: NotificationContextType = {
    answeredInquiriesCount,
    unreadAnsweredCount,
    refreshNotifications,
    markAnswerAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
