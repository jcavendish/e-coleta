import React, { useEffect } from 'react';
import { useToast, ToastMessage } from '../../../hooks/toast';

import './styles.css';
import { animated } from 'react-spring';

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const Toast: React.FC<ToastProps> = ({ toast, style }) => {

  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Remove Toast')
      removeToast(toast.id);
    }, 3000);
    console.log(timer);

    return () => {
      console.log('clear timeout')
      clearTimeout(timer);
    };
  }, [removeToast, toast.id]);

  return (
    <animated.div className="toasts" style={style}>
      <span>{toast.message}</span>
    </animated.div>
  )
}

export default Toast;
