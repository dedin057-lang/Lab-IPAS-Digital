/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface LabNotice {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface NotificationToastProps {
  notice: LabNotice | null;
  onDismiss?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notice, onDismiss }) => {
  if (!notice) return null;

  const bgStyles = {
    success: 'bg-emerald-50/95 border-emerald-200 text-emerald-900',
    info: 'bg-teal-50/95 border-teal-200 text-teal-900',
    warning: 'bg-amber-50/95 border-amber-200 text-amber-900',
    error: 'bg-rose-50/95 border-rose-200 text-rose-900'
  };

  const iconStyles = {
    success: 'text-emerald-600',
    info: 'text-teal-600',
    warning: 'text-amber-600',
    error: 'text-rose-600'
  };

  const IconComponent = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle
  }[notice.type];

  return (
    <div 
      className={`fixed top-18 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-sm backdrop-blur-xs transition-all duration-200 ${bgStyles[notice.type]} max-w-md animate-in fade-in slide-in-from-top-2`}
      role="status"
      aria-live="polite"
    >
      <IconComponent className={`w-5 h-5 shrink-0 ${iconStyles[notice.type]}`} />
      <span className="text-xs sm:text-sm font-medium leading-relaxed">{notice.message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="ml-auto text-xs opacity-60 hover:opacity-100 transition-opacity p-1"
          aria-label="Tutup notifikasi"
        >
          ✕
        </button>
      )}
    </div>
  );
};
