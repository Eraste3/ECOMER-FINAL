import { API_BASE_URL } from '../config/api';

export interface Payment {
  id: string;
  userId: string;
  type: 'compensation' | 'ecoshop' | 'citizen_call';
  amount: number;
  currency: 'XAF' | 'EUR';
  provider: 'mtn' | 'airtel' | 'moov';
  phoneNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  description: string;
  relatedId?: string; // ID of the related entity (intervention, order, etc.)
  createdAt: string;
  completedAt?: string;
}

export interface CreatePaymentRequest {
  userId: string;
  type: Payment['type'];
  amount: number;
  currency: Payment['currency'];
  provider: Payment['provider'];
  phoneNumber: string;
  description: string;
  relatedId?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: Payment['status'];
  reference?: string;
  message: string;
}

class PaymentService {
  async getPayments(userId: string): Promise<Payment[]> {
    // Mock implementation
    const mockPayments: Payment[] = [
      {
        id: 'PAY-001',
        userId: userId,
        type: 'compensation',
        amount: 5000,
        currency: 'XAF',
        provider: 'mtn',
        phoneNumber: '+242055123456',
        status: 'completed',
        reference: 'MTN-REF-001',
        description: 'Compensation intervention INT-001',
        relatedId: 'INT-001',
        createdAt: '2026-09-10T10:00:00Z',
        completedAt: '2026-09-10T10:05:00Z'
      },
      {
        id: 'PAY-002',
        userId: userId,
        type: 'ecoshop',
        amount: 15000,
        currency: 'XAF',
        provider: 'airtel',
        phoneNumber: '+242055123456',
        status: 'completed',
        reference: 'AIRTEL-REF-002',
        description: 'Achat lot LOT-001',
        relatedId: 'LOT-001',
        createdAt: '2026-09-08T14:00:00Z',
        completedAt: '2026-09-08T14:02:00Z'
      },
      {
        id: 'PAY-003',
        userId: userId,
        type: 'citizen_call',
        amount: 3000,
        currency: 'XAF',
        provider: 'moov',
        phoneNumber: '+242055123456',
        status: 'pending',
        description: 'Participation appel citoyen CALL-001',
        relatedId: 'CALL-001',
        createdAt: '2026-09-12T09:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPayments;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payments = await this.getPayments('mock-user');
    const payment = payments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    // Mock implementation - in real app, this would call the Mobile Money API
    const mockResponse: PaymentResponse = {
      paymentId: `PAY-${Date.now().toString().slice(-3)}`,
      status: 'pending',
      reference: `${data.provider.toUpperCase()}-REF-${Date.now().toString().slice(-6)}`,
      message: 'Payment initiated successfully'
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    return mockResponse;
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);
    
    // Simulate status check - in real app, this would query the Mobile Money API
    const statuses: Payment['status'][] = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (randomStatus === 'completed' && payment.status !== 'completed') {
      payment.status = 'completed';
      payment.completedAt = new Date().toISOString();
    } else if (randomStatus === 'failed') {
      payment.status = 'failed';
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    return payment;
  }

  async cancelPayment(paymentId: string): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);
    if (payment.status === 'completed') {
      throw new Error('Cannot cancel completed payment');
    }

    payment.status = 'cancelled';
    await new Promise(resolve => setTimeout(resolve, 300));
    return payment;
  }

  async getUserPaymentSummary(userId: string): Promise<{
    totalAmount: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
  }> {
    const payments = await this.getPayments(userId);
    
    return {
      totalAmount: payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      completedPayments: payments.filter(p => p.status === 'completed').length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      failedPayments: payments.filter(p => p.status === 'failed').length
    };
  }

  // Validate phone number format for Congo
  validatePhoneNumber(phoneNumber: string, provider: Payment['provider']): boolean {
    const patterns = {
      mtn: /^\+242(05|06|07)\d{7}$/,
      airtel: /^\+242(04|05)\d{7}$/,
      moov: /^\+242(01|02)\d{7}$/
    };

    return patterns[provider].test(phoneNumber);
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('+242')) {
      return phoneNumber;
    }
    if (phoneNumber.startsWith('0')) {
      return '+242' + phoneNumber;
    }
    return '+242' + phoneNumber;
  }
}

export const paymentService = new PaymentService();
