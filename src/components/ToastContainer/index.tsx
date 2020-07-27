import React from 'react';
import { useTransition } from 'react-spring';
import Toast from './Toast';

import './styles.css';

interface ToastMessage {
  id: string;
  message: string;
}

interface ToastContainerProps {
  toastMessages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toastMessages }) => {

  const animatedToasts = useTransition(toastMessages, toast => toast.id,
    {
      from: { top: '0px', opacity: 0.5 },
      enter: { bottom: '0px', opacity: 1 },
      leave: { top: '0px', opacity: 0.5 },
    }
  )

  return (
    <div className="toast-container">
      {animatedToasts.map(({item, key, props}) => (
        <Toast
          key={key}
          toast={item}
          style={props}
        />
      ))}
    </div>
  )
}

export default ToastContainer;
