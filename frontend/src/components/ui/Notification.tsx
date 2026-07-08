import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { NotificationItem } from '../../store/useNotificationStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Notification.css';

const IconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

export function NotificationContainer() {
  const notifications = useNotificationStore(state => state.notifications);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function NotificationToast({ notification }: { notification: NotificationItem }) {
  const removeNotification = useNotificationStore(state => state.removeNotification);
  const { id, type, message, duration = 3000 } = notification;
  const IconComponent = IconMap[type];

  // Auto-dismiss handler
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeNotification]);

  return (
    <div className={`notification-toast ${type}`}>
      <div className="toast-icon-wrapper">
        <IconComponent size={16} />
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={() => removeNotification(id)}
      >
        <X size={14} />
      </button>
    </div>
  );
}
