import { useState, useEffect } from 'react';
import {
  AlertTriangle, Droplets, MapPin, Phone, ShieldCheck, Heart,
  Search, Filter, Plus, Clock, Hospital, CheckCircle, ArrowRight
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = ['All', 'New Delhi', 'Mumbai', 'Bengaluru'];

export default function BloodNeedsPage({ setActivePage, onOpenRegister }) {
  const [requests, setRequests] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [search, setSearch] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // New Request Form
  const [newGroup, setNewGroup] = useState('O-');
  const [newHospital, setNewHospital] = useState('');
  const [newCity, setNewCity] = useState('New Delhi');
  const [newUnits, setNewUnits] = useState('2');
  const [newUrgency, setNewUrgency] = useState('Urgent');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newContact, setNewContact] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toast = useToast();

  useEffect(() => {
    const sync = () => setRequests(dataService.getBloodRequests());
    sync();
    return dataService.subscribe(sync);
  }, []);

  const handlePostRequest = (e) => {
    e.preventDefault();
    if (!newHospital.trim() || !newContact.trim()) {
      toast.warning('Required Details', 'Please specify the hospital name and authorized contact.');
      return;
    }

    dataService.createBloodRequest({
      bloodGroup: newGroup,
      hospitalName: newHospital,
      city: newCity,
      unitsNeeded: parseInt(newUnits) || 1,
      urgency: newUrgency,
      dateNeeded: newDate,
      contactCoordinator: 'Authorized Hospital Coordinator',
      contactPhone: newContact,
      description: newDesc || `Emergency request for ${newGroup} blood units.`,
    });

    toast.success('Urgent Request Broadcasted', 'The requirement is now live across the BloodConnect network.');
    setShowPostModal(false);
    setNewHospital('');
    setNewContact('');
    setNewDesc('');
  };

  const handleHelp = (req) => {
    toast.info(
      `Connecting to ${req.hospitalName}`,
      `Please contact the authorized liaison at ${req.contactPhone} to schedule immediate donation.`
    );
  };

  const filtered = requests.filter(r => {
    if (selectedGroup !== 'All' && r.bloodGroup !== selectedGroup) return false;
    if (selectedCity !== 'All' && r.city !== selectedCity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.hospitalName.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'Critical') {
      return (
        <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }} />
          Critical Emergency
        </span>
      );
    }
    if (urgency === 'Urgent') {
      return <span className="badge badge-warning">Urgent Priority</span>;
    }
    return <span className="badge badge-info">Standard Requirement</span>;
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Urgent Blood Needs & Requests
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
            Verified hospital and patient requirements. Every donation directly saves a life in critical care.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowPostModal(true)}
          style={{ gap: 6 }}
        >
          <Plus size={16} /> Broadcast Emergency Need
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)',
        border: '1px solid #FEE2E2',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={24} color="#FFF" />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--red-900)' }}>
            Strict Medical Verification & Privacy Shield
          </h4>
          <p style={{ fontSize: 12.5, color: 'var(--red-700)', marginTop: 2, lineHeight: 1.5 }}>
            To safeguard patient privacy, all listed requirements are coordinated exclusively through accredited hospital blood banks and verified NGO liaisons.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by hospital name or condition..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>
                  Blood Group: {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-input"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  City: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Request Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Urgent Requests Found"
          description="There are currently no open emergency requests matching your search criteria. Check back soon or register for a general blood camp."
          actionLabel="View Active Camps"
          onAction={() => setActivePage && setActivePage('nearby')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map(req => {
            const isCritical = req.urgency === 'Critical';

            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isCritical ? '4px solid var(--red-500)' : '4px solid var(--warning)',
                  boxShadow: isCritical ? '0 8px 24px rgba(220,38,38,0.12)' : 'var(--shadow-sm)',
                }}
              >
                <div>
                  {/* Top Line: Badge & Blood Group */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>{getUrgencyBadge(req.urgency)}</div>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: 'var(--red-50)',
                      border: '1.5px solid var(--red-200)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'var(--red-600)'
                    }}>
                      {req.bloodGroup}
                    </div>
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 4 }}>
                    {req.hospitalName}
                  </h3>

                  <div style={{ fontSize: 12.5, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                    <MapPin size={14} color="var(--red-500)" />
                    <span>{req.city}</span>
                    <span>•</span>
                    <Clock size={13} />
                    <span>Needed by {req.dateNeeded}</span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5, marginBottom: 16 }}>
                    {req.description}
                  </p>

                  {/* Units Progress */}
                  <div style={{ background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      <span style={{ color: 'var(--gray-600)' }}>Required Units:</span>
                      <span style={{ color: 'var(--red-600)' }}>{req.unitsFulfilled || 0} of {req.unitsNeeded} Fulfilled</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'var(--red-500)',
                          width: `${Math.min(100, ((req.unitsFulfilled || 0) / req.unitsNeeded) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinator & Help Button */}
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={12} color="var(--success)" />
                    <span>Liaison: <strong>{req.contactPhone}</strong></span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleHelp(req)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Heart size={15} /> Help This Request
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Urgent Request Modal */}
      {showPostModal && (
        <div className="modal-backdrop" onClick={() => setShowPostModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 className="modal-title">Broadcast Emergency Blood Need</h3>
              <button className="icon-btn" onClick={() => setShowPostModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Required Blood Group</label>
                  <select className="form-input" value={newGroup} onChange={e => setNewGroup(e.target.value)}>
                    {BLOOD_GROUPS.filter(b => b !== 'All').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Urgency Level</label>
                  <select className="form-input" value={newUrgency} onChange={e => setNewUrgency(e.target.value)}>
                    <option value="Critical">Critical (Immediate surgery)</option>
                    <option value="Urgent">Urgent (Within 24h)</option>
                    <option value="Moderate">Moderate (Within 48h)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Center Name <span style={{ color: 'var(--red-500)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AIIMS Trauma Center"
                  value={newHospital}
                  onChange={e => setNewHospital(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <select className="form-input" value={newCity} onChange={e => setNewCity(e.target.value)}>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Units Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-input"
                    value={newUnits}
                    onChange={e => setNewUnits(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Authorized Contact Phone / Extension <span style={{ color: 'var(--red-500)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 11 2616 5000 (Ext 412)"
                  value={newContact}
                  onChange={e => setNewContact(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Context / Patient Case</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="Brief clinical context (e.g. Pediatric emergency surgery support)"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer" style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowPostModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Broadcast Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
