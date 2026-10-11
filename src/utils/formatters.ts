import { CallPriority, CallStatus, AgentStatus } from '../types';

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getPriorityConfig(priority: CallPriority) {
  switch (priority) {
    case 'critical':
      return {
        label: 'Critical',
        bg: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'high':
      return {
        label: 'High',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'normal':
      return {
        label: 'Normal',
        bg: 'bg-blue-100 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'low':
      return {
        label: 'Low',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusConfig(status: CallStatus) {
  switch (status) {
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500 animate-pulse',
      };
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-teal-100 text-teal-800 border-teal-200',
        dot: 'bg-teal-500',
      };
    case 'missed':
      return {
        label: 'Missed',
        bg: 'bg-red-100 text-red-800 border-red-200',
        dot: 'bg-red-500',
      };
    case 'queued':
      return {
        label: 'Queued',
        bg: 'bg-sky-100 text-sky-800 border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'transferred':
      return {
        label: 'Transferred',
        bg: 'bg-purple-100 text-purple-800 border-purple-200',
        dot: 'bg-purple-500',
      };
    case 'abandoned':
      return {
        label: 'Abandoned',
        bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
        dot: 'bg-zinc-400',
      };
  }
}

export function getAgentStatusConfig(status: AgentStatus) {
  switch (status) {
    case 'available':
      return {
        label: 'Available',
        color: 'emerald',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500',
        description: 'Ready to receive incoming calls',
      };
    case 'on_call':
      return {
        label: 'On Call',
        color: 'amber',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-500 animate-pulse',
        description: 'Currently handling a live customer call',
      };
    case 'break':
      return {
        label: 'On Break',
        color: 'blue',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-500',
        description: 'Away on scheduled rest / meal break',
      };
    case 'offline':
      return {
        label: 'Offline',
        color: 'slate',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        badge: 'bg-slate-400',
        description: 'Not signed in to the ACD telephone queue',
      };
  }
}

