export type AgentStatus = 'available' | 'on_call' | 'break' | 'offline';

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'agent' | 'senior_agent' | 'lead';
  status: AgentStatus;
  statusSince: string;
}

export type CallPriority = 'critical' | 'high' | 'normal' | 'low';

export type CallStatus = 'queued' | 'in_progress' | 'completed' | 'missed' | 'transferred' | 'abandoned';

export type CallDisposition = 
  | 'resolved'
  | 'escalated'
  | 'follow_up_needed'
  | 'callback_requested'
  | 'billing_adjusted'
  | 'wrong_number'
  | 'spam';

export interface CallRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  queue: string;
  priority: CallPriority;
  status: CallStatus;
  startedAt?: string;
  endedAt?: string;
  durationSeconds: number;
  waitTimeSeconds: number;
  agentId?: string;
  agentName?: string;
  notes?: string;
  disposition?: CallDisposition;
  csatRating?: number; // 1 to 5
}

export interface CustomerTicket {
  id: string;
  title: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  category: string;
}

export interface CustomerInteraction {
  id: string;
  date: string;
  type: 'call' | 'email' | 'chat' | 'ticket';
  summary: string;
  agentName: string;
  outcome: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  plan: 'Enterprise VIP' | 'Pro Business' | 'Growth' | 'Starter';
  lifetimeValue: string;
  avatar: string;
  location: string;
  memberSince: string;
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  notes: string;
  tickets: CustomerTicket[];
  interactions: CustomerInteraction[];
}

export interface TodayStats {
  callsHandled: number;
  avgHandleTimeSec: number;
  missedCalls: number;
  csatPercentage: number;
  firstCallResolutionRate: number;
}

