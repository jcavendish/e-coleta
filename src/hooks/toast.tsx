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
    const toast = {
      id: uuid(),
      message: message.message
    }
    setMessages([...messages, toast]);
  }, [messages])

  const removeToast = useCallback((id: string) => {
    setMessages(messages.filter(toast => toast.id !== id));
  }, [messages])

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
