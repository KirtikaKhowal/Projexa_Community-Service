import { useState, useEffect } from 'react';
import {
  Droplets, Heart, Calendar, MapPin, Clock, Award, Bell, ChevronRight,
  TrendingUp, Users, FileText, Activity, Zap, Search, RefreshCw, AlertTriangle,
  Truck, ShieldCheck, ArrowRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NearbyBloodCamps from './NearbyBloodCamps';
import DonationRegistrationModal from '../components/DonationRegistrationModal';
import { dataService } from '../services/dataService';
import { SkeletonStatCard, SkeletonCard } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

export default function DonorDashboard({ activePage, setActivePage }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [upcomingRegs, setUpcomingRegs] = useState([]);
  const [bloodNeeds, setBloodNeeds] = useState([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      setStats(dataService.getDonorStats());
      setUserProfile(dataService.getUserProfile());
      const regs = dataService.getRegistrations().filter(r => r.status === 'Confirmed' || r.status === 'Pending');
      setUpcomingRegs(regs);
      setBloodNeeds(dataService.getBloodRequests().slice(0, 3));
    };

    sync();
    const unsub = dataService.subscribe(sync);
    const timer = setTimeout(() => setLoading(false), 500);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  const STATS = [
    { label: 'Total Donations',   value: String(stats.totalDonations || 0), icon: Droplets, color: 'var(--red-500)',  bg: 'var(--danger-light)' },
    { label: 'Upcoming Campaigns', value: String(stats.upcomingCampaigns || 0), icon: Calendar, color: 'var(--info)',     bg: 'var(--info-light)' },
    { label: 'Total Contributed', value: stats.totalContribution || '₹0',    icon: Heart,    color: 'var(--success)',  bg: 'var(--success-light)' },
    { label: 'Reward Points',     value: `${(stats.rewardPoints || 0).toLocaleString()} pts`, icon: Award, color: 'var(--warning)',  bg: 'var(--warning-light)', sub: stats.currentLevel },
  ];

  const QUICK_LINKS = [
    { id: 'registrations', label: 'My Registrations', icon: Calendar, count: upcomingRegs.length },
    { id: 'nearby',        label: 'Find Blood Camps', icon: MapPin },
    { id: 'home-collection', label: 'Home Collection', icon: Truck },
    { id: 'contribute',    label: 'Support NGOs',    icon: Heart },
    { id: 'certificates',  label: 'Certificates',    icon: FileText },
    { id: 'rewards',       label: 'Rewards & Points', icon: Award },
  ];

  return (
    <div className="layout-sidebar">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="page-main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
              Hello, {userProfile.name || 'Kirtika'}! 👋
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              Blood Group: <strong style={{ color: 'var(--red-600)' }}>{stats.bloodGroup || 'O+'}</strong> • Status:{' '}
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>Eligible to Donate</span>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Notifications" onClick={() => setActivePage('notifications')}>
              <Bell size={18} />
              <span className="notif-badge" />
            </button>
            <div
              className="avatar"
              style={{ width: 36, height: 36, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: 'none' }}
              onClick={() => setActivePage('settings')}
            >
              AT
            </div>
          </div>
        </div>

        <div className="page-content">
          {/* Top KPI Stat Cards */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
              : STATS.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="stat-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div className="stat-icon-wrap" style={{ background: s.bg }}>
                          <Icon size={18} color={s.color} strokeWidth={2} />
                        </div>
                        <TrendingUp size={14} color="var(--success)" />
                      </div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                      {s.sub && (
                        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>
                          {s.sub}
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>

          {/* Main 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Functional Red Hero Banner with 4 CTAs */}
              {loading ? (
                <SkeletonCard height={220} />
              ) : (
                <div style={{
                  background: 'linear-gradient(130deg, var(--red-500) 0%, var(--red-700) 100%)',
                  borderRadius: 20, padding: '28px 32px', position: 'relative', overflow: 'hidden', color: 'white',
                  boxShadow: '0 10px 28px rgba(220,38,38,0.22)',
                }}>
                  <div style={{ position: 'absolute', right: -24, top: -24, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', right: 56, bottom: -36, width: 140, height: 140, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                      National Voluntary Blood Network
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15, marginBottom: 10, letterSpacing: '-0.01em' }}>
                      Donate Blood.<br />Save Human Lives.
                    </h2>
                    <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', marginBottom: 20, maxWidth: 360, lineHeight: 1.6 }}>
                      Every donation of whole blood can save up to 3 lives. Choose a service below to take immediate action:
                    </p>

                    {/* 4 Functional CTA Buttons */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        className="btn"
                        style={{ background: 'white', color: 'var(--red-600)', fontWeight: 800, padding: '10px 18px', borderRadius: 12, fontSize: 13 }}
                        onClick={() => setActivePage('nearby')}
                      >
                        <MapPin size={14} /> 1. Find a Camp
                      </button>
                      <button
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, padding: '10px 16px', borderRadius: 12, fontSize: 13 }}
                        onClick={() => setIsRegisterOpen(true)}
                      >
                        <Calendar size={14} /> 2. Register for Donation
                      </button>
                      <button
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, padding: '10px 16px', borderRadius: 12, fontSize: 13 }}
                        onClick={() => setActivePage('home-collection')}
                      >
                        <Truck size={14} /> 3. Request Home Collection
                      </button>
                      <button
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, padding: '10px 16px', borderRadius: 12, fontSize: 13 }}
                        onClick={() => setActivePage('contribute')}
                      >
                        <Heart size={14} /> 4. Donate Financially
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Registered Campaigns */}
              <div className="card card-p">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gray-900)' }}>Upcoming Registered Drives</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Your scheduled appointments</div>
                  </div>
                  <button className="btn btn-ghost btn-xs" onClick={() => setActivePage('registrations')}>
                    View All
                  </button>
                </div>

                {upcomingRegs.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No upcoming scheduled donations"
                    description="You have no active camp registrations. Choose a nearby camp to schedule your appointment."
                    onAction={() => setActivePage('nearby')}
                    actionLabel="Discover Camps"
                    size="sm"
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {upcomingRegs.map(r => (
                      <div
                        key={r.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '12px 16px',
                          background: 'var(--gray-50)',
                          borderRadius: 14,
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setActivePage('registrations')}
                      >
                        <div style={{ width: 42, height: 42, background: 'var(--danger-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Droplets size={18} color="var(--red-500)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--gray-900)' }}>{r.campName}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <span>📅 {r.date}</span>
                            <span>⏰ {r.timeSlot}</span>
                            <span>📍 {r.location}</span>
                          </div>
                        </div>
                        <span className="badge badge-success">{r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Urgent Hospital Needs (Replaces fake stock, matches real requirement) */}
              <div className="card card-p">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gray-900)' }}>Urgent Hospital Blood Needs</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Real-time emergency requirements in your area</div>
                  </div>
                  <button className="btn btn-ghost btn-xs" onClick={() => setActivePage('blood-needs')}>
                    See All Needs
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bloodNeeds.map(need => (
                    <div
                      key={need.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: '#FFF9F9',
                        border: '1px solid #FEE2E2',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--red-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15 }}>
                          {need.bloodGroup}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{need.hospitalName}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>{need.city} • Needed by {need.dateNeeded}</div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => setActivePage('blood-needs')}
                      >
                        Help Request
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Donor Profile & Level Card */}
              <div className="card card-p" style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                  <div className="avatar" style={{ width: 68, height: 68, fontSize: 22, fontWeight: 800, margin: '0 auto', background: 'var(--red-50)', color: 'var(--red-500)' }}>
                    KK
                  </div>
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, background: 'var(--success)', borderRadius: '50%', border: '2.5px solid white' }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>{userProfile.name || 'Kirtika Khowal'}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
                  <span className="badge badge-red">{stats.currentLevel || 'Life Saver'}</span>
                  <span className="badge badge-orange">{stats.rewardPoints || 0} pts</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{stats.totalDonations}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Donations</div>
                  </div>
                  <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{stats.upcomingCampaigns}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Booked</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{stats.totalContribution}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Donated</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions / Shortcuts */}
              <div className="card card-p">
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>Platform Shortcuts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {QUICK_LINKS.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10 }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                          <Icon size={16} color="var(--red-500)" />
                          {item.label}
                        </span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="badge badge-danger">{item.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certificates Quick Preview */}
              <div style={{ background: 'linear-gradient(135deg, #FFFDF9 0%, #FEF3C7 100%)', border: '1.5px solid #FCD34D', borderRadius: 18, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Award size={20} color="#B45309" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#92400E' }}>Official Donor Certificates</span>
                </div>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.5, marginBottom: 12 }}>
                  Every completed donation earns an accredited certificate of appreciation.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setActivePage('certificates')}
                  style={{ width: '100%', justifyContent: 'center', background: 'white', borderColor: '#F59E0B', color: '#92400E', fontWeight: 700 }}
                >
                  View My Certificates
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {isRegisterOpen && (
        <DonationRegistrationModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={() => {
            setStats(dataService.getDonorStats());
            setUpcomingRegs(dataService.getRegistrations().filter(r => r.status === 'Confirmed'));
          }}
        />
      )}
    </div>
  );
}
