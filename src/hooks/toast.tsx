import React, { createContext, useState, useContext, useCallback } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  message: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    setMessages(state => {
      const toast = {
        id: uuid(),
        message: message.message
      }
      return [...state, toast];
    });
  }, [])

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(toast => toast.id !== id));
  }, [])

  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      { children }
      <ToastContainer toastMessages={messages} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext);
}
