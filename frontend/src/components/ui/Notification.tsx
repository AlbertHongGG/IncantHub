import React, { useEffect, useState } from 'react';
import { useNotificationStore, type NotificationItem } from '../../store/useNotificationStore';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './Notification.css';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info
};

function Toast({ item, onRemove }: { item: NotificationItem, onRemove: (id: string) => void }) {
  const [isLeaving, setIsLeaving] = useState(false);
  
  useEffect(() => {
    if (item.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, item.duration);
      return () => clearTimeout(timer);
    }
  }, [item]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(item.id), 300); // Wait for exit animation
  };

  const Icon = iconMap[item.type] || Info;

  return (
    <div className={`ui-toast type-${item.type} ${isLeaving ? 'toast-leave' : 'toast-enter'}`}>
      <Icon size={16} className="toast-icon" />
      <span className="toast-message">{item.message}</span>
      <button className="toast-close" onClick={handleRemove}>
        <X size={14} />
      </button>
    </div>
  );
}

export function NotificationContainer() {
  const notifications = useNotificationStore(state => state.notifications);
  const removeNotification = useNotificationStore(state => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="ui-toast-container">
      {notifications.map(n => (
        <Toast key={n.id} item={n} onRemove={removeNotification} />
      ))}
    </div>
  );
}
