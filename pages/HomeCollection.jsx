import { useState, useEffect } from 'react';
import {
  Truck, Calendar, Clock, MapPin, User, Phone, CheckCircle2,
  AlertCircle, ShieldCheck, ArrowRight, RefreshCw, FileText
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';

const TIMELINE_STEPS = ['Requested', 'Under Review', 'Scheduled', 'Team Assigned', 'Completed'];
const TIME_SLOTS = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function HomeCollection({ onSuccess }) {
  const [activeTab, setActiveTab] = useState('request'); // 'request' | 'tracking'
  const [homeRequests, setHomeRequests] = useState([]);
  const [ngos, setNgos] = useState([]);
  
  // Form State
  const [donorName, setDonorName] = useState('Kirtika Khowal');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('Flat 402, Sunshine Apartments, Sector 14, Rohini, Delhi');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [reason, setReason] = useState('Elder family member care at home');
  const [notes, setNotes] = useState('Please call 15 minutes prior to arrival.');
  const [selectedNgo, setSelectedNgo] = useState('Indian Red Cross Society');
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      setHomeRequests(dataService.getHomeCollections());
      setNgos(dataService.getNgos());
    };
    sync();
    return dataService.subscribe(sync);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim() || !preferredDate) {
      toast.warning('Required Information', 'Please provide your full address, mobile number, and preferred date.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const created = dataService.requestHomeCollection({
        donorName,
        phone,
        bloodGroup,
        address,
        preferredDate,
        preferredTime,
        reason,
        notes,
        ngoName: selectedNgo,
      });

      setSubmitting(false);
      toast.success('Request Submitted Successfully!', `Reference ID: ${created.id}. Our medical team will review availability.`);
      setActiveTab('tracking');
    }, 600);
  };

  const getStepIndex = (status) => {
    const idx = TIMELINE_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck size={26} color="var(--red-500)" />
            Home Blood Collection Service
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
            Direct doorstep blood donation for donors unable to visit donation centers or camps.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--gray-100)', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'request' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('request')}
          >
            New Request
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'tracking' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('tracking')}
          >
            Track Status ({homeRequests.length})
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div style={{
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 14,
        padding: '14px 18px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
          <strong>Service Availability Notice:</strong> Home collection availability depends on participating NGO / hospital blood collection mobile units and clinical verification. Sanitized clinical gear is deployed on site.
        </div>
      </div>

      {/* TAB 1: Request Form */}
      {activeTab === 'request' && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
            Schedule a Home Collection
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--red-500)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone <span style={{ color: 'var(--red-500)' }}>*</span></label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-input"
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
              >
                {BLOOD_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Partner NGO</label>
              <select
                className="form-input"
                value={selectedNgo}
                onChange={e => setSelectedNgo(e.target.value)}
              >
                {ngos.map(n => (
                  <option key={n.id} value={n.name}>{n.name} ({n.city})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Residential Address & Landmark <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="House/Flat number, Street, Landmark, City & Pin Code"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Preferred Date <span style={{ color: 'var(--red-500)' }}>*</span></label>
              <input
                type="date"
                className="form-input"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time Slot</label>
              <select
                className="form-input"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
              >
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Requesting Home Collection</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Caretaking family elder, mobility constraints, remote location"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Instructions / Notes</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="e.g. Gate code, intercom number, parking details"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: 200 }}
            >
              {submitting ? 'Submitting Request...' : 'Submit Home Collection Request'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Tracking & History */}
      {activeTab === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {homeRequests.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Truck size={40} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Home Collection Requests Found</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
                You have not requested a home collection yet. Fill out the request form to schedule doorstep collection.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ margin: '16px auto 0' }}
                onClick={() => setActiveTab('request')}
              >
                Create Request
              </button>
            </div>
          ) : (
            homeRequests.map(req => {
              const currentStepIdx = getStepIndex(req.status);

              return (
                <div key={req.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--red-500)' }}>{req.id}</span>
                        <span className="badge badge-danger">{req.status}</span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginTop: 4 }}>
                        {req.donorName} ({req.bloodGroup}) — {req.address}
                      </h3>
                      <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 2 }}>
                        Assigned Partner: <strong style={{ color: 'var(--gray-700)' }}>{req.ngoName}</strong> • {req.assignedTeam}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Appointment Window</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>
                        {req.preferredDate} ({req.preferredTime})
                      </div>
                    </div>
                  </div>

                  {/* Operational Timeline Progress Bar */}
                  <div style={{ margin: '20px 0 16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, position: 'relative' }}>
                      {TIMELINE_STEPS.map((stepName, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={stepName} style={{ textAlign: 'center' }}>
                            <div style={{
                              height: 6,
                              borderRadius: 3,
                              background: isDone ? 'var(--red-500)' : 'var(--gray-200)',
                              marginBottom: 8,
                            }} />
                            <div style={{
                              fontSize: 11,
                              fontWeight: isCurrent ? 800 : 600,
                              color: isDone ? 'var(--red-600)' : 'var(--gray-400)',
                            }}>
                              {stepName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 10, fontSize: 12, color: 'var(--gray-600)' }}>
                    <strong>Clinical Note:</strong> The mobile unit phlebotomist will contact you prior to departure. Please ensure a clean, well-lit seating area and stay hydrated.
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
