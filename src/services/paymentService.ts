import { PaymentMethod, PaymentInfo } from '../contexts/OrderContext';

// PG사 타입
export type PGProvider = 'toss' | 'iamport' | 'kakao' | 'naver' | 'paypal';

// 결제 요청 데이터
export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  method: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  successUrl: string;
  failUrl: string;
}

// 결제 응답 데이터
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  redirectUrl?: string;
  paymentData?: any;
}

// 결제 검증 데이터
export interface PaymentVerification {
  orderId: string;
  transactionId: string;
  amount: number;
  method: PaymentMethod;
  pgProvider: PGProvider;
}

// PG사 인터페이스
export interface PGService {
  name: string;
  provider: PGProvider;
  initialize(config: any): Promise<void>;
  requestPayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(verification: PaymentVerification): Promise<boolean>;
  cancelPayment(transactionId: string, reason?: string): Promise<boolean>;
  refundPayment(transactionId: string, amount: number, reason?: string): Promise<boolean>;
}

// 토스페이먼츠 구현
export class TossPaymentsService implements PGService {
  name = 'TossPayments';
  provider: PGProvider = 'toss';
  private clientKey: string = '';
  private secretKey: string = '';

  async initialize(config: { clientKey: string; secretKey: string }): Promise<void> {
    this.clientKey = config.clientKey;
    this.secretKey = config.secretKey;
    
    // 토스페이먼츠 SDK 로드
    if (typeof window !== 'undefined') {
      // 실제 구현에서는 토스페이먼츠 SDK를 동적으로 로드
      console.log('TossPayments SDK loaded');
    }
  }

  async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // 실제 구현에서는 토스페이먼츠 API 호출
      console.log('TossPayments payment request:', request);
      
      // 시뮬레이션을 위한 응답
      const transactionId = `toss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        transactionId,
        redirectUrl: `/payment/success?transactionId=${transactionId}`,
      };
    } catch (error) {
      return {
        success: false,
        errorCode: 'PAYMENT_FAILED',
        errorMessage: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.',
      };
    }
  }

  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    try {
      // 실제 구현에서는 토스페이먼츠 API로 결제 검증
      console.log('TossPayments payment verification:', verification);
      return true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async cancelPayment(transactionId: string, reason?: string): Promise<boolean> {
    try {
      // 실제 구현에서는 토스페이먼츠 API로 결제 취소
      console.log('TossPayments payment cancellation:', { transactionId, reason });
      return true;
    } catch (error) {
      console.error('Payment cancellation failed:', error);
      return false;
    }
  }

  async refundPayment(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    try {
      // 실제 구현에서는 토스페이먼츠 API로 환불 처리
      console.log('TossPayments payment refund:', { transactionId, amount, reason });
      return true;
    } catch (error) {
      console.error('Payment refund failed:', error);
      return false;
    }
  }
}

// 아임포트 구현
export class IamportService implements PGService {
  name = 'Iamport';
  provider: PGProvider = 'iamport';
  private imp: any = null;

  async initialize(config: { impCode: string }): Promise<void> {
    // 실제 구현에서는 아임포트 SDK 로드
    console.log('Iamport SDK loaded with code:', config.impCode);
  }

  async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // 실제 구현에서는 아임포트 API 호출
      console.log('Iamport payment request:', request);
      
      const transactionId = `iamport_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        transactionId,
        redirectUrl: `/payment/success?transactionId=${transactionId}`,
      };
    } catch (error) {
      return {
        success: false,
        errorCode: 'PAYMENT_FAILED',
        errorMessage: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.',
      };
    }
  }

  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    try {
      console.log('Iamport payment verification:', verification);
      return true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async cancelPayment(transactionId: string, reason?: string): Promise<boolean> {
    try {
      console.log('Iamport payment cancellation:', { transactionId, reason });
      return true;
    } catch (error) {
      console.error('Payment cancellation failed:', error);
      return false;
    }
  }

  async refundPayment(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    try {
      console.log('Iamport payment refund:', { transactionId, amount, reason });
      return true;
    } catch (error) {
      console.error('Payment refund failed:', error);
      return false;
    }
  }
}

// 결제 서비스 관리자
export class PaymentServiceManager {
  private services: Map<PGProvider, PGService> = new Map();
  private currentProvider: PGProvider = 'toss';

  // PG사 등록
  registerService(service: PGService): void {
    this.services.set(service.provider, service);
  }

  // 현재 PG사 설정
  setProvider(provider: PGProvider): void {
    if (this.services.has(provider)) {
      this.currentProvider = provider;
    } else {
      throw new Error(`PG사 ${provider}가 등록되지 않았습니다.`);
    }
  }

  // 현재 PG사 가져오기
  getCurrentService(): PGService {
    const service = this.services.get(this.currentProvider);
    if (!service) {
      throw new Error(`PG사 ${this.currentProvider}가 초기화되지 않았습니다.`);
    }
    return service;
  }

  // 결제 요청
  async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const service = this.getCurrentService();
    return await service.requestPayment(request);
  }

  // 결제 검증
  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    const service = this.getCurrentService();
    return await service.verifyPayment(verification);
  }

  // 결제 취소
  async cancelPayment(transactionId: string, reason?: string): Promise<boolean> {
    const service = this.getCurrentService();
    return await service.cancelPayment(transactionId, reason);
  }

  // 환불
  async refundPayment(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    const service = this.getCurrentService();
    return await service.refundPayment(transactionId, amount, reason);
  }

  // 등록된 PG사 목록
  getRegisteredProviders(): PGProvider[] {
    return Array.from(this.services.keys());
  }
}

// 결제 서비스 인스턴스 생성
export const paymentService = new PaymentServiceManager();

// 기본 PG사 등록
export const initializePaymentServices = async () => {
  // 토스페이먼츠 등록
  const tossService = new TossPaymentsService();
  await tossService.initialize({
    clientKey: process.env.REACT_APP_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
    secretKey: process.env.REACT_APP_TOSS_SECRET_KEY || 'test_sk_D4yKeq5bgrpKRd0JYbLVGX0lzW6Y',
  });
  paymentService.registerService(tossService);

  // 아임포트 등록
  const iamportService = new IamportService();
  await iamportService.initialize({
    impCode: process.env.REACT_APP_IAMPORT_CODE || 'imp12345678',
  });
  paymentService.registerService(iamportService);

  // 기본 PG사 설정
  paymentService.setProvider('toss');
};

// 결제 방법별 PG사 매핑
export const getPGProviderForMethod = (method: PaymentMethod): PGProvider => {
  switch (method) {
    case 'card':
    case 'bank_transfer':
      return 'toss';
    case 'kakao_pay':
      return 'toss'; // 카카오페이는 토스페이먼츠를 통해 처리
    case 'naver_pay':
      return 'toss'; // 네이버페이는 토스페이먼츠를 통해 처리
    case 'toss_pay':
      return 'toss';
    default:
      return 'toss';
  }
};

// 결제 상태 확인
export const checkPaymentStatus = async (transactionId: string): Promise<PaymentInfo['status']> => {
  try {
    // 실제 구현에서는 PG사 API로 결제 상태 확인
    console.log('Checking payment status for:', transactionId);
    return 'completed';
  } catch (error) {
    console.error('Payment status check failed:', error);
    return 'failed';
  }
};

// 결제 금액 검증
export const validatePaymentAmount = (expectedAmount: number, actualAmount: number): boolean => {
  return Math.abs(expectedAmount - actualAmount) < 1; // 1원 이하 차이는 허용
}; 