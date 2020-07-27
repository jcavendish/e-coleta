import React, { useEffect } from 'react';
import { useToast, ToastMessage } from '../../../hooks/toast';

import './styles.css';

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const Toast: React.FC<ToastProps> = ({ toast, style }) => {

  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [removeToast, toast.id]);

  useEffect(() => {
    console.log('entra')
  }, [])

  return (
    <div className="toasts" style={style}>
      <span>{toast.message}</span>
    </div>
  )
}

export default Toast;
