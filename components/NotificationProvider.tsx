'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IconBell, IconShield } from './Icons';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

type NotificationContextType = {
  notify: (title: string, message: string, type?: Notification['type']) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((title: string, message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className={`pointer-events-auto w-80 p-5 rounded-3xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right duration-300 ${
              n.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-white' : 
              n.type === 'info' ? 'bg-slate-900/90 border-slate-700/50 text-white' :
              'bg-slate-900/90 border-slate-700/50 text-white'
            }`}
          >
            <div className="flex gap-4 items-start">
              <div className={`p-2 rounded-xl ${n.type === 'success' ? 'bg-emerald-500' : 'bg-primary'}`}>
                {n.type === 'success' ? <IconShield size={20} color="white" /> : <IconBell size={20} color="white" />}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm uppercase tracking-tight">{n.title}</h4>
                <p className="text-xs text-white/70 mt-1 font-medium leading-relaxed">{n.message}</p>
              </div>
              <button 
                onClick={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))}
                className="text-white/30 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within a NotificationProvider');
  return context;
};
