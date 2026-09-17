import { useState, useEffect } from 'react';
import { Droplets, Search, Bell, Settings, TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Users, FileText, BarChart2, Heart, Home, CheckCircle } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,
  Legend, ArcElement, PointElement, LineElement, Filler,
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import { SkeletonStatCard, SkeletonTable } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const TOP_STATS = [
  { label: 'Total Users',        value: '12,450', icon: Users,       color: 'var(--info)',    bg: 'var(--info-light)',    trend: '+8.2%', up: true },
  { label: 'Verified NGOs',      value: '84',     icon: Shield,      color: 'var(--success)', bg: 'var(--success-light)', trend: '+3',    up: true },
  { label: 'Active Campaigns',   value: '126',    icon: BarChart2,   color: 'var(--red-500)', bg: 'var(--danger-light)', trend: '+12',   up: true },
  { label: 'Verified Donations', value: '4,382',  icon: Droplets,    color: '#8B5CF6',        bg: '#EDE9FE',             trend: '+5.4%', up: true },
  { label: 'Contributions',      value: '₹8.4L',  icon: Heart,       color: 'var(--warning)', bg: 'var(--warning-light)', trend: '+18%',  up: true },
  { label: 'Home Requests',      value: '1,250',  icon: Home,        color: '#06B6D4',        bg: '#CFFAFE',             trend: '+2.1%', up: true },
  { label: 'Certificates',       value: '3,980',  icon: FileText,    color: 'var(--success)', bg: 'var(--success-light)', trend: '+450',  up: true },
  { label: 'Lives Impacted',     value: '5,230',  icon: CheckCircle, color: 'var(--red-500)', bg: 'var(--danger-light)', trend: '+15%',  up: true },
];

const PENDING = [
  { type: 'NGO Verification', name: 'Jeevan Foundation',  detail: 'Pune',         submitted: '2 days ago', urgent: false },
  { type: 'Campaign Approval', name: 'Diwali Blood Drive', detail: 'Life Care NGO', submitted: '1 day ago',  urgent: true },
  { type: 'NGO Verification', name: 'Seva Blood Bank',    detail: 'Chennai',       submitted: '3 days ago', urgent: false },
  { type: 'Report',           name: 'Q3 Donation Report', detail: 'Red Cross',      submitted: '5 hrs ago',  urgent: false },
];

const ACTIVITY = [
  { icon: CheckCircle, color: 'var(--success)', title: 'Campaign Approved', desc: 'AIIMS Blood Drive approved', time: '10 min ago' },
  { icon: Users,       color: 'var(--info)',    title: 'New User Registered', desc: 'Priya Sharma joined from Mumbai', time: '25 min ago' },
  { icon: Shield,      color: 'var(--success)', title: 'NGO Verified', desc: 'Helping Hands NGO verified', time: '1 hr ago' },
  { icon: AlertTriangle, color: 'var(--warning)', title: 'Low Blood Stock', desc: 'O- critically low at 3 banks', time: '2 hrs ago' },
  { icon: Heart,       color: '#8B5CF6',        title: 'Large Contribution', desc: '₹50,000 received from CSR', time: '3 hrs ago' },
];

const BAR_DATA = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
  datasets: [
    { label: 'New Users', data: [420,580,520,720,850,780,920,1050,1180], backgroundColor: 'rgba(37,99,235,0.85)', borderRadius: 6, borderSkipped: false },
    { label: 'Donations', data: [280,380,320,480,560,510,620,710,820],   backgroundColor: 'rgba(217,45,58,0.85)', borderRadius: 6, borderSkipped: false },
  ],
};

const DONUT_DATA = {
  labels: ['A+','O+','B+','AB+','O-','Others'],
  datasets: [{
    data: [28,22,18,12,10,10],
    backgroundColor: ['#D92D3A','#2563EB','#22C55E','#F59E0B','#8B5CF6','#64748B'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
};

const BAR_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 14 } },
    tooltip: { backgroundColor: 'rgba(17,24,39,0.92)', titleFont: { family: 'Inter', weight: '700', size: 13 }, bodyFont: { family: 'Inter', size: 12 }, padding: 12, cornerRadius: 10 },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 }, color: '#94A3B8' } },
    y: { grid: { color: '#F1F5F9' }, ticks: { font: { family: 'Inter', size: 12 }, color: '#94A3B8' } },
  },
};

const DONUT_OPTS = {
  responsive: true, maintainAspectRatio: false, cutout: '68%',
  plugins: {
    legend: { position: 'right', labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 10 } },
    tooltip: { backgroundColor: 'rgba(17,24,39,0.92)', titleFont: { family: 'Inter', weight: '700' }, bodyFont: { family: 'Inter' }, padding: 10, cornerRadius: 8 },
  },
};

export default function AdminDashboard({ activePage, setActivePage }) {
  const [loading, setLoading] = useState(true);
  const [pendingState, setPendingState] = useState(PENDING);
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleApprove = (name) => {
    setPendingState(prev => prev.filter(p => p.name !== name));
    toast.success('Approved!', `${name} has been approved successfully.`);
  };
  const handleReject = (name) => {
    setPendingState(prev => prev.filter(p => p.name !== name));
    toast.error('Rejected', `${name} has been rejected.`);
  };

  return (
    <div className="layout-sidebar">
      <Sidebar activePage={activePage} setActivePage={setActivePage} variant="admin" />

      <main className="page-main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-search">
            <Search size={14} className="topbar-search-icon" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            <input placeholder="Search users, NGOs, campaigns…" aria-label="Search" />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="notif-badge" />
            </button>
            <button className="icon-btn" aria-label="Settings">
              <Settings size={18} />
            </button>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 12, fontWeight: 800, background: 'var(--gray-800)', color: 'white' }}>
              AD
            </div>
          </div>
        </div>

        <div className="page-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Platform-wide metrics and management overview</p>
          </div>

          {/* Stats Grid (8 items, 4 col) */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
              : TOP_STATS.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="stat-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div className="stat-icon-wrap" style={{ background: s.bg }}>
                          <Icon size={18} color={s.color} strokeWidth={1.8} />
                        </div>
                        <span className={`stat-trend ${s.up ? 'stat-trend-up' : 'stat-trend-down'}`}>
                          {s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                          {s.trend}
                        </span>
                      </div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  );
                })
            }
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
            {/* Bar Chart */}
            <div className="card card-p">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Monthly Growth</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>User registrations & donation trends</div>
                </div>
                <div className="tab-bar">
                  {['3M','6M','1Y'].map(t => <button key={t} className={`tab-btn${t==='1Y'?' active':''}`}>{t}</button>)}
                </div>
              </div>
              <div style={{ height: 230 }}>
                <Bar data={BAR_DATA} options={BAR_OPTS} />
              </div>
            </div>

            {/* Blood Group Donut */}
            <div className="card card-p">
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>Blood Group Mix</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 16 }}>Distribution of donors by blood type</div>
              <div style={{ height: 200 }}>
                <Doughnut data={DONUT_DATA} options={DONUT_OPTS} />
              </div>
            </div>
          </div>

          {/* Activity + Pending row */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
            {/* Activity */}
            <div className="card card-p">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Recent Activity</div>
              </div>
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: i < ACTIVITY.length - 1 ? 12 : 0, marginBottom: i < ACTIVITY.length - 1 ? 12 : 0, borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <div style={{ width: 32, height: 32, background: `${a.color}18`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={a.color} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-900)' }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.desc}</div>
                      <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pending Approvals */}
            <div className="card">
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Pending Approvals</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                    {pendingState.length > 0 ? `${pendingState.length} items requiring review` : 'All clear!'}
                  </div>
                </div>
              </div>
              {pendingState.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <CheckCircle size={40} color="var(--success)" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-700)' }}>All caught up!</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 4 }}>No pending approvals.</div>
                </div>
              ) : (
                <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Submitted</th>
                        <th>Priority</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <SkeletonTable rows={4} cols={5} /> : pendingState.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <span className={`badge ${item.type.includes('NGO') ? 'badge-blue' : item.type.includes('Campaign') ? 'badge-red' : 'badge-gray'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{item.detail}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-500)' }}>
                              <Clock size={11} />{item.submitted}
                            </div>
                          </td>
                          <td>
                            {item.urgent
                              ? <span className="badge badge-red"><AlertTriangle size={9} /> Urgent</span>
                              : <span className="badge badge-gray">Normal</span>
                            }
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 7 }}>
                              <button className="btn btn-success btn-xs" onClick={() => handleApprove(item.name)}>Approve</button>
                              <button className="btn btn-danger btn-xs" onClick={() => handleReject(item.name)}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
