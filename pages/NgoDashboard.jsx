import { useState, useEffect } from 'react';
import {
  Heart, Users, Calendar, Clock, MapPin, Truck, Award, Shield,
  Plus, CheckCircle2, XCircle, ChevronRight, AlertCircle, Phone,
  BarChart2, FileText, Check, Navigation, DollarSign
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';

export default function NgoDashboard({ setActivePage }) {
  const [stats, setStats] = useState({});
  const [camps, setCamps] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [homeRequests, setHomeRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'campaigns' | 'registrations' | 'collections'

  // Create Campaign Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 04:00 PM');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [lat, setLat] = useState('28.6139');
  const [lng, setLng] = useState('77.2090');
  const [totalSeats, setTotalSeats] = useState('100');
  const [contactPhone, setContactPhone] = useState('+91 98110 00112');
  const [selectedGroups, setSelectedGroups] = useState(['All Groups']);

  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      setStats(dataService.getNgoStats());
      setCamps(dataService.getCamps());
      setRegistrations(dataService.getRegistrations());
      setHomeRequests(dataService.getHomeCollections());
      setContributions(dataService.getContributions());
    };
    sync();
    return dataService.subscribe(sync);
  }, []);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !date) {
      toast.warning('Required Fields', 'Please complete all campaign details.');
      return;
    }

    dataService.createCampaign({
      name,
      description: description || 'Voluntary community blood donation drive organized by verified partner NGO.',
      date,
      time,
      address,
      city,
      lat: parseFloat(lat) || 28.6139,
      lng: parseFloat(lng) || 77.2090,
      bloodGroupsNeeded: selectedGroups,
      totalSeats: parseInt(totalSeats) || 100,
      ngoName: 'Indian Red Cross Society',
      contactPhone,
      coordinator: 'Dr. Ananya Ray',
    });

    toast.success('Campaign Created Successfully!', 'Donors across India can now discover and register for your camp.');
    setShowCreateModal(false);
    setName('');
    setDescription('');
    setAddress('');
  };

  const handleCompleteDonation = (regId) => {
    dataService.completeRegistration(regId);
    toast.success('Donation Verified! 🩸', 'Donor has been awarded points and an official verified certificate was generated.');
  };

  const handleUpdateHomeStatus = (reqId, newStatus) => {
    const assignedTeam = newStatus === 'Scheduled' ? 'Red Cross Mobile Unit #2' : undefined;
    dataService.updateHomeCollectionStatus(reqId, newStatus, assignedTeam);
    toast.info('Status Updated', `Home collection request is now "${newStatus}".`);
  };

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto' }}>
      {/* Top NGO Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: 20,
        padding: '24px 28px',
        color: 'white',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: 'var(--red-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={28} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Indian Red Cross Society</h2>
              <span className="badge badge-success" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ADE80' }}>
                Verified Partner NGO
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>
              License No: DL-BB-2018-091 • Medical Operational Portal
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          style={{ gap: 6 }}
        >
          <Plus size={16} /> Create New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Active Campaigns</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--red-500)', marginTop: 4 }}>
            {stats.activeCampaigns || 0}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Total Registered Donors</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--gray-900)', marginTop: 4 }}>
            {stats.totalRegistrations || 0}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Completed Donations</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>
            {stats.completedDonations || 0}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Pending Home Requests</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--warning)', marginTop: 4 }}>
            {stats.pendingHomeRequests || 0}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Financial Support Received</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--info)', marginTop: 4 }}>
            {stats.fundsRaised || '₹0'}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'campaigns', label: `My Campaigns (${camps.length})` },
          { id: 'registrations', label: `Donor Check-ins (${registrations.length})` },
          { id: 'collections', label: `Home Collection Queue (${homeRequests.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Campaigns Management */}
      {(activeTab === 'overview' || activeTab === 'campaigns') && (
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>Organized Campaigns</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowCreateModal(true)}>
              + New Camp
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {camps.map(camp => (
              <div key={camp.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{camp.name}</h4>
                    <span className="badge badge-danger">{camp.status}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 4 }}>
                    📍 {camp.address}, {camp.city} • 📅 {camp.date} ({camp.time})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Registered</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--red-600)' }}>
                      {camp.registeredCount} / {camp.totalSeats} Donors
                    </div>
                  </div>

                  {camp.status !== 'Cancelled' && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--red-500)' }}
                      onClick={() => {
                        if (window.confirm(`Cancel campaign: ${camp.name}?`)) {
                          dataService.cancelCampaign(camp.id);
                          toast.info('Campaign Cancelled', camp.name);
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Donor Registrations / Attendance Check-in */}
      {(activeTab === 'overview' || activeTab === 'registrations') && (
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>
            Donor Registrations & Completion Verification
          </h3>

          <div style={{ overflowX: 'auto' }} className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Ref ID</th>
                  <th style={{ padding: 12 }}>Donor</th>
                  <th style={{ padding: 12 }}>Blood Group</th>
                  <th style={{ padding: 12 }}>Campaign</th>
                  <th style={{ padding: 12 }}>Appointment</th>
                  <th style={{ padding: 12 }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 12, fontWeight: 700, color: 'var(--red-600)' }}>{reg.id}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{reg.donorName}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{reg.donorPhone}</div>
                    </td>
                    <td style={{ padding: 12, fontWeight: 800 }}>{reg.bloodGroup}</td>
                    <td style={{ padding: 12, color: 'var(--gray-700)', maxWidth: 200 }}>{reg.campName}</td>
                    <td style={{ padding: 12, fontSize: 12 }}>{reg.date} ({reg.timeSlot})</td>
                    <td style={{ padding: 12 }}>
                      <span className={`badge ${reg.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right' }}>
                      {reg.status === 'Confirmed' ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteDonation(reg.id)}
                          style={{ gap: 4 }}
                        >
                          <Check size={13} /> Mark Donated
                        </button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700 }}>
                          ✓ Certificate Issued
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Home Collection Requests */}
      {(activeTab === 'overview' || activeTab === 'collections') && (
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>
            Home Blood Collection Requests Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {homeRequests.map(req => (
              <div key={req.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: 4 }}>{req.status}</span>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                      {req.donorName} ({req.bloodGroup}) — {req.phone}
                    </h4>
                    <div style={{ fontSize: 12.5, color: 'var(--gray-600)', marginTop: 2 }}>
                      📍 {req.address}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Preferred Schedule</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>
                      {req.preferredDate} ({req.preferredTime})
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 10, fontSize: 12, color: 'var(--gray-600)', marginBottom: 14 }}>
                  <strong>Reason:</strong> {req.reason} {req.notes && `• Note: ${req.notes}`}
                </div>

                {/* Status Switcher Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  {req.status === 'Requested' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleUpdateHomeStatus(req.id, 'Scheduled')}
                    >
                      Schedule Appointment
                    </button>
                  )}
                  {req.status === 'Scheduled' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleUpdateHomeStatus(req.id, 'Team Assigned')}
                    >
                      Dispatch Medical Team
                    </button>
                  )}
                  {req.status !== 'Completed' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateHomeStatus(req.id, 'Completed')}
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Blood Donation Camp</h3>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Camp Name <span style={{ color: 'var(--red-500)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Connaught Place LifeSavers Camp"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Date <span style={{ color: 'var(--red-500)' }}>*</span></label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue / Full Address <span style={{ color: 'var(--red-500)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Central Park Pavilion, Outer Circle, Connaught Place"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <select className="form-input" value={city} onChange={e => setCity(e.target.value)}>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Lat</label>
                  <input type="text" className="form-input" value={lat} onChange={e => setLat(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Lng</label>
                  <input type="text" className="form-input" value={lng} onChange={e => setLng(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Target Donor Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={totalSeats}
                    onChange={e => setTotalSeats(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Coordinator Helpline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Campaign Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
