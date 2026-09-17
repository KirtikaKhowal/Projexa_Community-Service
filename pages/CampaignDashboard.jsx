import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Users, Droplets, Search, Filter,
  Navigation, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { dataService } from '../services/dataService';
import DonationRegistrationModal from '../components/DonationRegistrationModal';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

export default function CampaignDashboard({ activePage, setActivePage }) {
  const [camps, setCamps] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const sync = () => setCamps(dataService.getCamps());
    sync();
    return dataService.subscribe(sync);
  }, []);

  const openGoogleMaps = (camp) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${camp.lat},${camp.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const filteredCamps = camps.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (selectedCity !== 'All' && c.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.ngoName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: 20,
        padding: '26px 30px',
        color: 'white',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: 6 }}>
            National Blood Drive Discovery
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>
            Active Blood Donation Campaigns
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 13.5, marginTop: 4, maxWidth: 540 }}>
            Find organized donation drives near you, track available donor slots, and schedule your appointment with verified partner NGOs.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActivePage && setActivePage('nearby')}
          style={{ gap: 6 }}
        >
          <MapPin size={15} /> Open Map Explorer
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="card" style={{ padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 12, marginBottom: 14 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search campaigns by name, city or NGO..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-input"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="All">All Locations</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div>
            <select
              className="form-input"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Almost Full">Almost Full</option>
              <option value="Full">Full</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', 'Registration Open', 'Almost Full'].map(st => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterStatus(st)}
              style={{ padding: '4px 12px', fontSize: 12 }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCamps.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Campaigns Found"
          description="No active campaigns match your selected filters. Please adjust your criteria or reset the search."
          actionLabel="Reset Filters"
          onAction={() => {
            setFilterStatus('All');
            setSelectedCity('All');
            setSearch('');
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredCamps.map(camp => {
            const isFull = camp.status === 'Full';
            const isAlmostFull = camp.status === 'Almost Full';
            const remaining = Math.max(0, camp.totalSeats - camp.registeredCount);

            return (
              <div
                key={camp.id}
                className="card"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isFull ? '4px solid var(--gray-400)' : isAlmostFull ? '4px solid var(--warning)' : '4px solid var(--red-500)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className={`badge ${isFull ? 'badge-neutral' : isAlmostFull ? 'badge-warning' : 'badge-danger'}`}>
                      {camp.status}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)' }}>
                      📍 {camp.city}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 4 }}>
                    {camp.name}
                  </h3>

                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>
                    Organized by <strong style={{ color: 'var(--gray-800)' }}>{camp.ngoName}</strong>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5, marginBottom: 14 }}>
                    {camp.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--gray-600)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <MapPin size={14} color="var(--red-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{camp.address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} color="var(--gray-400)" /> {camp.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="var(--gray-400)" /> {camp.time}
                      </span>
                    </div>
                  </div>

                  {/* Donor Capacity Bar */}
                  <div style={{ background: 'var(--gray-50)', padding: '10px 12px', borderRadius: 10, marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      <span style={{ color: 'var(--gray-600)' }}>Capacity:</span>
                      <span style={{ color: 'var(--red-600)' }}>{camp.registeredCount} / {camp.totalSeats} ({remaining} remaining)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: isAlmostFull ? 'var(--warning)' : 'var(--red-500)',
                          width: `${Math.min(100, (camp.registeredCount / camp.totalSeats) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card CTAs */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => openGoogleMaps(camp)}
                    style={{ flex: 1, gap: 5 }}
                  >
                    <Navigation size={13} /> Directions
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={isFull}
                    onClick={() => {
                      setSelectedCamp(camp);
                      setIsRegisterOpen(true);
                    }}
                    style={{ flex: 1 }}
                  >
                    {isFull ? 'Camp Full' : 'Register Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
        <DonationRegistrationModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          preselectedCamp={selectedCamp}
          onSuccess={() => setCamps(dataService.getCamps())}
        />
      )}
    </div>
  );
}
