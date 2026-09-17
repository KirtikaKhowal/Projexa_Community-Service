import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Navigation, XCircle, CheckCircle2,
  AlertTriangle, Shield, ArrowRight, ExternalLink, RefreshCw, FileText
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

export default function RegistrationsPage({ setActivePage, onOpenRegister }) {
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Confirmed' | 'Completed' | 'Cancelled'
  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      setRegistrations(dataService.getRegistrations());
    };
    sync();
    return dataService.subscribe(sync);
  }, []);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this donation registration?')) {
      dataService.cancelRegistration(id);
      toast.info('Registration Cancelled', `Booking ${id} has been cancelled.`);
    }
  };

  const openDirections = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  const filtered = registrations.filter(r => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  const getStatusBadge = (status) => {
    if (status === 'Confirmed') return <span className="badge badge-success">Confirmed</span>;
    if (status === 'Completed') return <span className="badge badge-info">Completed</span>;
    if (status === 'Cancelled') return <span className="badge badge-neutral">Cancelled</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="page-title">My Camp Registrations</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
            Track and manage your upcoming and completed blood donation appointments.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActivePage ? setActivePage('nearby') : onOpenRegister && onOpenRegister()}
        >
          <MapPin size={15} /> Find New Camp
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {['All', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
          <button
            key={tab}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(tab)}
          >
            {tab} {tab === 'All' ? `(${registrations.length})` : `(${registrations.filter(r => r.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={filter === 'All' ? "No Camp Registrations Yet" : `No ${filter} Registrations`}
          description="You haven't registered for any blood donation drive matching this filter. Find a nearby camp and schedule your life-saving appointment today."
          actionLabel="Discover Nearby Camps"
          onAction={() => setActivePage && setActivePage('nearby')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(reg => {
            const isConfirmed = reg.status === 'Confirmed';
            const isCompleted = reg.status === 'Completed';

            return (
              <div
                key={reg.id}
                className="card"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  borderLeft: isConfirmed ? '4px solid var(--success)' : isCompleted ? '4px solid var(--info)' : '4px solid var(--gray-300)',
                }}
              >
                {/* Top Info Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-500)', letterSpacing: '0.04em' }}>
                        {reg.id}
                      </span>
                      {getStatusBadge(reg.status)}
                      <span className="badge" style={{ background: 'var(--red-50)', color: 'var(--red-600)', fontWeight: 800 }}>
                        {reg.bloodGroup}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
                      {reg.campName}
                    </h3>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                      Organized by <strong style={{ color: 'var(--gray-700)' }}>{reg.ngoName}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Donor</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)' }}>{reg.donorName}</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'var(--gray-50)',
                  borderRadius: 12,
                  fontSize: 13,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color="var(--red-500)" />
                    <div>
                      <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: 11 }}>Date</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{reg.date}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="var(--red-500)" />
                    <div>
                      <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: 11 }}>Time Slot</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{reg.timeSlot}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} color="var(--red-500)" />
                    <div>
                      <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: 11 }}>Address</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{reg.location}</strong>
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                {reg.instructions && (
                  <div style={{ fontSize: 12.5, color: 'var(--gray-600)', background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, borderLeft: '3px solid var(--border)' }}>
                    <strong>Prep Instructions:</strong> {reg.instructions}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => openDirections(reg.location)}
                    style={{ gap: 6 }}
                  >
                    <Navigation size={14} /> Open in Google Maps
                  </button>

                  {isCompleted && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActivePage && setActivePage('certificates')}
                      style={{ gap: 6 }}
                    >
                      <FileText size={14} /> View Certificate
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleCancel(reg.id)}
                      style={{ color: 'var(--red-500)', gap: 5 }}
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
