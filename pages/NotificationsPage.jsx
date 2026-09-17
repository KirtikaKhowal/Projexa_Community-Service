import { useState, useEffect } from 'react';
import {
  Bell, CheckCheck, Droplets, Calendar, Award, Truck, AlertTriangle,
  ArrowRight, ShieldCheck, Heart
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

export default function NotificationsPage({ setActivePage }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const toast = useToast();

  useEffect(() => {
    const sync = () => setNotifications(dataService.getNotifications());
    sync();
    return dataService.subscribe(sync);
  }, []);

  const markAllRead = () => {
    dataService.markAllNotificationsRead();
    toast.success('All Read', 'All notifications have been marked as read.');
  };

  const handleNotificationClick = (item) => {
    dataService.markNotificationRead(item.id);
    if (item.actionLink && setActivePage) {
      setActivePage(item.actionLink);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'registration':
        return <Calendar size={18} color="#2563EB" />;
      case 'campaign':
        return <Droplets size={18} color="#DC2626" />;
      case 'urgent':
        return <AlertTriangle size={18} color="#D97706" />;
      case 'reward':
      case 'certificate':
        return <Award size={18} color="#16A34A" />;
      case 'home-collection':
        return <Truck size={18} color="#0891B2" />;
      default:
        return <Bell size={18} color="#64748B" />;
    }
  };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={24} color="var(--red-500)" />
            Notifications
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13.5, marginTop: 4 }}>
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          style={{ gap: 6 }}
        >
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      {/* Notifications Feed */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You don't have any updates right now. When you register for camps, donate, or earn rewards, notifications will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className="card"
              style={{
                padding: 18,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                cursor: 'pointer',
                background: item.read ? 'white' : '#FFF9F9',
                borderLeft: item.read ? '1px solid var(--border)' : '4px solid var(--red-500)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: 'var(--gray-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {getIcon(item.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <h4 style={{ fontSize: 15, fontWeight: item.read ? 700 : 800, color: 'var(--gray-900)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{item.time}</span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5, margin: 0 }}>
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
