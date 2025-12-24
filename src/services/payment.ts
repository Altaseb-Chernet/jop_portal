import { api } from './api'

export interface SubscriptionPlan {
  name: string
  price: number
  duration: number
  features: {
    jobPostings: string
    featuredJobs: string
    candidateSearch: string
    support: string
  }
}

export interface PaymentInitRequest {
  subscriptionType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

export interface EmployerPaymentInitRequest {
  email: string
  subscriptionType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

export interface PaymentResponse {
  id: number
  transactionId: string
  chapaCheckoutUrl: string
  chapaReference: string
  subscriptionType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED'
  startedAt: string
  completedAt?: string
  expiresAt: string
  failureReason?: string
}

export async function getSubscriptionPlans(): Promise<Record<string, SubscriptionPlan>> {
  const { data } = await api.get<Record<string, SubscriptionPlan>>('/api/payment/subscription-plans')
  return data
}

export async function initializePayment(request: PaymentInitRequest): Promise<PaymentResponse> {
  const { data } = await api.post<PaymentResponse>('/api/payment/initialize', request)
  return data
}

export async function initializeEmployerPayment(request: EmployerPaymentInitRequest): Promise<PaymentResponse> {
  const { data } = await api.post<PaymentResponse>('/api/payment/initialize-employer', request)
  return data
}

export async function verifyPayment(transactionId: string): Promise<PaymentResponse> {
  const { data } = await api.get<PaymentResponse>(`/api/payment/verify/${transactionId}`)
  return data
}
