import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Agent, 
  AgentStatus, 
  CallRecord, 
  Customer, 
  CallDisposition, 
  TodayStats 
} from '../types';
import rawCustomers from '../data/customers.json';
import rawCalls from '../data/calls.json';
import rawQueue from '../data/initialQueue.json';
import { getStorageItem, setStorageItem } from '../utils/storage';

interface CallCenterContextType {
  // Auth
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
  
  // Agent State
  agent: Agent;
  updateAgentStatus: (status: AgentStatus) => void;

  // Queue
  queue: CallRecord[];
  acceptCall: (callId: string) => void;
  simulateIncomingCall: () => void;

  // Active Call
  activeCall: CallRecord | null;
  activeCustomer: Customer | null;
  activeCallDuration: number;
  isCallEnded: boolean; // Wrap-up stage
  isMuted: boolean;
  isOnHold: boolean;
  toggleMute: () => void;
  toggleHold: () => void;
  activeCallNotes: string;
  setActiveCallNotes: (notes: string) => void;
  activeCallDisposition: CallDisposition | '';
  setActiveCallDisposition: (disposition: CallDisposition | '') => void;
  endActiveCall: () => void;
  saveAndCloseActiveCall: () => boolean;

  // History & Customers
  callHistory: CallRecord[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  viewCustomerById: (customerId: string) => void;

  // Statistics
  todayStats: TodayStats;
}

const STORAGE_KEYS = {
  AUTH: 'omnicall_auth',
  AGENT: 'omnicall_agent',
  QUEUE: 'omnicall_queue',
  CALLS: 'omnicall_calls',
  CUSTOMERS: 'omnicall_customers',
  ACTIVE_CALL: 'omnicall_active_call',
  ACTIVE_DURATION: 'omnicall_active_duration',
  ACTIVE_NOTES: 'omnicall_active_notes',
  ACTIVE_DISPOSITION: 'omnicall_active_disposition',
  IS_CALL_ENDED: 'omnicall_is_call_ended',
};

const defaultAgent: Agent = {
  id: 'agent-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@omnicall.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'agent',
  status: 'available',
  statusSince: new Date().toISOString(),
};

const CallCenterContext = createContext<CallCenterContextType | undefined>(undefined);

export const CallCenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    getStorageItem<boolean>(STORAGE_KEYS.AUTH, true)
  );

  // Agent State
  const [agent, setAgent] = useState<Agent>(() => 
    getStorageItem<Agent>(STORAGE_KEYS.AGENT, defaultAgent)
  );

  // Queue State
  const [queue, setQueue] = useState<CallRecord[]>(() => 
    getStorageItem<CallRecord[]>(STORAGE_KEYS.QUEUE, rawQueue as CallRecord[])
  );

  // Calls History State
  const [callHistory, setCallHistory] = useState<CallRecord[]>(() => 
    getStorageItem<CallRecord[]>(STORAGE_KEYS.CALLS, rawCalls as CallRecord[])
  );

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(() => 
    getStorageItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, rawCustomers as Customer[])
  );

  // Active Call State
  const [activeCall, setActiveCall] = useState<CallRecord | null>(() => 
    getStorageItem<CallRecord | null>(STORAGE_KEYS.ACTIVE_CALL, null)
  );
  const [activeCallDuration, setActiveCallDuration] = useState<number>(() => 
    getStorageItem<number>(STORAGE_KEYS.ACTIVE_DURATION, 0)
  );
  const [isCallEnded, setIsCallEnded] = useState<boolean>(() => 
    getStorageItem<boolean>(STORAGE_KEYS.IS_CALL_ENDED, false)
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [activeCallNotes, setActiveCallNotes] = useState<string>(() => 
    getStorageItem<string>(STORAGE_KEYS.ACTIVE_NOTES, '')
  );
  const [activeCallDisposition, setActiveCallDisposition] = useState<CallDisposition | ''>(() => 
    getStorageItem<CallDisposition | ''>(STORAGE_KEYS.ACTIVE_DISPOSITION, '')
  );

  // Customer Drawer Selection
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.AUTH, isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.AGENT, agent);
  }, [agent]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.QUEUE, queue);
  }, [queue]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CALLS, callHistory);
  }, [callHistory]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
  }, [customers]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVE_CALL, activeCall);
    setStorageItem(STORAGE_KEYS.ACTIVE_DURATION, activeCallDuration);
    setStorageItem(STORAGE_KEYS.IS_CALL_ENDED, isCallEnded);
    setStorageItem(STORAGE_KEYS.ACTIVE_NOTES, activeCallNotes);
    setStorageItem(STORAGE_KEYS.ACTIVE_DISPOSITION, activeCallDisposition);
  }, [activeCall, activeCallDuration, isCallEnded, activeCallNotes, activeCallDisposition]);

  // Active Call Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeCall && !isCallEnded && !isOnHold) {
      interval = setInterval(() => {
        setActiveCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall, isCallEnded, isOnHold]);

  // Queue Wait Time increment
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prevQueue) => 
        prevQueue.map((item) => ({
          ...item,
          waitTimeSeconds: item.waitTimeSeconds + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute active customer details
  const activeCustomer = useMemo(() => {
    if (!activeCall) return null;
    return customers.find((c) => c.id === activeCall.customerId) || null;
  }, [activeCall, customers]);

  // View customer details by ID helper
  const viewCustomerById = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setSelectedCustomer(cust);
    }
  };

  // Auth Handlers
  const login = (email?: string) => {
    setIsAuthenticated(true);
    if (email) {
      setAgent((prev) => ({
        ...prev,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    updateAgentStatus('offline');
  };

  // Agent Status Handler
  const updateAgentStatus = (status: AgentStatus) => {
    setAgent((prev) => ({
      ...prev,
      status,
      statusSince: new Date().toISOString(),
    }));
  };

  // Queue Actions
  const acceptCall = (callId: string) => {
    const targetCall = queue.find((c) => c.id === callId);
    if (!targetCall) return;

    // Remove from queue
    setQueue((prev) => prev.filter((c) => c.id !== callId));

    // Initialize active call
    const callRecord: CallRecord = {
      ...targetCall,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      agentId: agent.id,
      agentName: agent.name,
    };

    setActiveCall(callRecord);
    setActiveCallDuration(0);
    setIsCallEnded(false);
    setIsMuted(false);
    setIsOnHold(false);
    setActiveCallNotes(targetCall.notes || '');
    setActiveCallDisposition('');
    updateAgentStatus('on_call');
  };

  // Simulate an incoming call into queue
  const simulateIncomingCall = () => {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const priorities: CallRecord['priority'][] = ['critical', 'high', 'normal', 'low'];
    const queues = ['Enterprise VIP Support', 'Billing & Accounts', 'Technical Support', 'General Inquiries'];
    
    const newCall: CallRecord = {
      id: `queue-${Date.now()}`,
      customerId: randomCustomer.id,
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      queue: queues[Math.floor(Math.random() * queues.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: 'queued',
      waitTimeSeconds: 1,
      durationSeconds: 0,
      notes: `Incoming inquiry regarding account services for ${randomCustomer.company || 'personal workspace'}.`,
    };

    setQueue((prev) => [newCall, ...prev]);
  };

  // Call Control Actions
  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleHold = () => setIsOnHold((prev) => !prev);

  const endActiveCall = () => {
    setIsCallEnded(true);
    setIsMuted(false);
    setIsOnHold(false);
  };

  const saveAndCloseActiveCall = (): boolean => {
    if (!activeCall) return false;
    if (!activeCallDisposition) {
      alert('Please select a call disposition before saving and closing.');
      return false;
    }

    const completedCall: CallRecord = {
      ...activeCall,
      status: 'completed',
      endedAt: new Date().toISOString(),
      durationSeconds: activeCallDuration,
      notes: activeCallNotes,
      disposition: activeCallDisposition,
      csatRating: 5,
    };

    // Append to call history
    setCallHistory((prev) => [completedCall, ...prev]);

    // Update customer interaction history
    if (activeCustomer) {
      const newInteraction = {
        id: `INT-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'call' as const,
        summary: activeCallNotes || `Call completed with disposition: ${activeCallDisposition}`,
        agentName: agent.name,
        outcome: activeCallDisposition.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      };

      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === activeCustomer.id
            ? { ...c, interactions: [newInteraction, ...c.interactions] }
            : c
        )
      );
    }

    // Reset active call state
    setActiveCall(null);
    setActiveCallDuration(0);
    setIsCallEnded(false);
    setActiveCallNotes('');
    setActiveCallDisposition('');
    updateAgentStatus('available');
    return true;
  };

  // Calculate Today's Stats
  const todayStats: TodayStats = useMemo(() => {
    const completedCalls = callHistory.filter((c) => c.status === 'completed');
    const missedCalls = callHistory.filter((c) => c.status === 'missed');
    
    const totalCallsHandled = completedCalls.length;
    const totalDuration = completedCalls.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    const avgHandleTimeSec = totalCallsHandled > 0 ? Math.round(totalDuration / totalCallsHandled) : 0;
    
    const ratedCalls = completedCalls.filter((c) => c.csatRating !== undefined);
    const positiveCsat = ratedCalls.filter((c) => (c.csatRating ?? 0) >= 4).length;
    const csatPercentage = ratedCalls.length > 0 ? Math.round((positiveCsat / ratedCalls.length) * 100) : 95;

    const resolvedCalls = completedCalls.filter((c) => c.disposition === 'resolved').length;
    const firstCallResolutionRate = totalCallsHandled > 0 ? Math.round((resolvedCalls / totalCallsHandled) * 100) : 88;

    return {
      callsHandled: totalCallsHandled,
      avgHandleTimeSec,
      missedCalls: missedCalls.length,
      csatPercentage,
      firstCallResolutionRate,
    };
  }, [callHistory]);

  const value = {
    isAuthenticated,
    login,
    logout,
    agent,
    updateAgentStatus,
    queue,
    acceptCall,
    simulateIncomingCall,
    activeCall,
    activeCustomer,
    activeCallDuration,
    isCallEnded,
    isMuted,
    isOnHold,
    toggleMute,
    toggleHold,
    activeCallNotes,
    setActiveCallNotes,
    activeCallDisposition,
    setActiveCallDisposition,
    endActiveCall,
    saveAndCloseActiveCall,
    callHistory,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    viewCustomerById,
    todayStats,
  };

  return <CallCenterContext.Provider value={value}>{children}</CallCenterContext.Provider>;
};

export const useCallCenter = () => {
  const context = useContext(CallCenterContext);
  if (!context) {
    throw new Error('useCallCenter must be used within a CallCenterProvider');
  }
  return context;
};
