import { useState, useEffect } from 'react';
import {
  Droplets, Home, BarChart2, ClipboardList, Users, Heart, Truck, Award,
  FileText, Bell, PieChart, Settings, ChevronRight, LogOut, MapPin,
  AlertTriangle, Shield, CheckCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';

const DONOR_GROUPS = [
  {
    label: 'Main',
    items: [
      { id: 'donor-dashboard', label: 'Dashboard', icon: Home },
      { id: 'nearby',          label: 'Find Camps', icon: MapPin },
      { id: 'campaigns',       label: 'Campaigns',  icon: BarChart2 },
      { id: 'registrations',   label: 'Registrations', icon: ClipboardList },
    ],
  },
  {
    label: 'Services',
    items: [
      { id: 'home-collection', label: 'Home Collection', icon: Truck },
      { id: 'blood-needs',     label: 'Blood Needs',     icon: AlertTriangle },
      { id: 'contribute',      label: 'Support NGOs',    icon: Heart },
    ],
  },
  {
    label: 'Recognition',
    items: [
      { id: 'rewards',       label: 'Rewards & Points', icon: Award },
      { id: 'certificates',  label: 'Certificates',     icon: FileText },
      { id: 'notifications', label: 'Notifications',    icon: Bell },
    ],
  },
];

const NGO_GROUPS = [
  {
    label: 'NGO Operations',
    items: [
      { id: 'ngo-dashboard',   label: 'Overview',            icon: Home },
      { id: 'campaigns',       label: 'Manage Campaigns',    icon: BarChart2 },
      { id: 'registrations',   label: 'Donor Registrations', icon: ClipboardList },
      { id: 'home-collection', label: 'Home Collections',    icon: Truck },
    ],
  },
  {
    label: 'Community',
    items: [
      { id: 'blood-needs',     label: 'Post Blood Need',     icon: AlertTriangle },
      { id: 'contribute',      label: 'Contributions',       icon: Heart },
      { id: 'notifications',   label: 'Notifications',       icon: Bell },
    ],
  },
];

const ADMIN_GROUPS = [
  {
    label: 'Platform Administration',
    items: [
      { id: 'admin-dashboard', label: 'Overview',        icon: Home },
      { id: 'campaigns',       label: 'All Campaigns',   icon: BarChart2 },
      { id: 'blood-needs',     label: 'Blood Requests',  icon: AlertTriangle },
      { id: 'contribute',      label: 'Contributions',   icon: Heart },
      { id: 'certificates',    label: 'Certificates',    icon: Award },
    ],
  },
];

function NavItem({ item, activePage, setActivePage }) {
  const Icon = item.icon;
  const isActive = activePage === item.id;
  return (
    <button
      type="button"
      className={`nav-item${isActive ? ' active' : ''}`}
      onClick={() => setActivePage(item.id)}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </button>
  );
}

export default function Sidebar({ activePage, setActivePage, variant }) {
  const [role, setRole] = useState(dataService.getRole());

  useEffect(() => {
    const sync = () => setRole(dataService.getRole());
    return dataService.subscribe(sync);
  }, []);

  const activeRole = variant || role;
  const groups = activeRole === 'admin' ? ADMIN_GROUPS : activeRole === 'ngo' ? NGO_GROUPS : DONOR_GROUPS;

  const handleRoleChange = (newRole) => {
    dataService.setRole(newRole);
    if (newRole === 'donor') setActivePage('donor-dashboard');
    else if (newRole === 'ngo') setActivePage('ngo-dashboard');
    else if (newRole === 'admin') setActivePage('admin-dashboard');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Platform navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
          aria-label="Go to landing page"
        >
          <div style={{
            width: 34, height: 34, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--red-500), var(--red-600))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(217,45,58,0.25)',
          }}>
            <Droplets size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gray-900)' }}>
              BloodConnect
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--red-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              {activeRole === 'admin' ? 'Admin Panel' : activeRole === 'ngo' ? 'NGO Portal' : 'Donor Portal'}
            </div>
          </div>
        </button>
      </div>

      {/* Role Switcher Pill in Sidebar */}
      <div style={{ padding: '0 14px 12px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3,
          background: 'var(--gray-100)', padding: 3, borderRadius: 10, fontSize: 11
        }}>
          {['donor', 'ngo', 'admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                padding: '5px 0',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                textTransform: 'capitalize',
                background: activeRole === r ? 'white' : 'transparent',
                color: activeRole === r ? 'var(--red-600)' : 'var(--gray-500)',
                boxShadow: activeRole === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {groups.map(group => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            <span className="sidebar-section-label">{group.label}</span>
            {group.items.map(item => (
              <NavItem
                key={item.id}
                item={item}
                activePage={activePage}
                setActivePage={setActivePage}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="avatar"
            style={{ width: 34, height: 34, fontSize: 12, background: 'var(--red-50)', color: 'var(--red-500)', fontWeight: 800 }}
          >
            {activeRole === 'admin' ? 'AD' : activeRole === 'ngo' ? 'RC' : 'KK'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeRole === 'admin' ? 'Super Admin' : activeRole === 'ngo' ? 'Red Cross Official' : 'Kirtika Khowal'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red-500)' }}>
              {activeRole === 'admin' ? 'System Lead' : activeRole === 'ngo' ? 'DL-BB-2018-091' : 'Life Saver ✦'}
            </div>
          </div>
          <button
            type="button"
            className="icon-btn icon-btn-sm"
            onClick={() => {
              dataService.logout();
              setActivePage('login');
            }}
            aria-label="Logout"
            title="Logout"
            style={{ color: 'var(--gray-400)' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
