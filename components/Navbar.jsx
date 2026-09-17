import { useState, useEffect } from 'react';
import { Droplets, Menu, X, MapPin, Shield, LogOut, User } from 'lucide-react';
import { dataService } from '../services/dataService';

const NAV_LINKS = [
  { id: 'landing',         label: 'Home' },
  { id: 'nearby',          label: 'Blood Camps' },
  { id: 'campaigns',       label: 'Campaigns' },
  { id: 'blood-needs',     label: 'Blood Needs' },
  { id: 'home-collection', label: 'Home Collection' },
  { id: 'contribute',      label: 'Support NGOs' },
];

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState('donor');
  const [isAuth, setIsAuth] = useState(dataService.isAuthenticated());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    const sync = () => {
      setRole(dataService.getRole());
      setIsAuth(dataService.isAuthenticated());
    };
    const unsub = dataService.subscribe(sync);
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'white',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid var(--border)`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'background 0.25s, box-shadow 0.25s',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
        {/* Logo */}
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="BloodConnect home"
        >
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--red-500), var(--red-600))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(217,45,58,0.3)',
          }}>
            <Droplets size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.01em' }}>
              BloodConnect
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--red-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>
              Every Drop Counts
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 20 }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              type="button"
              onClick={() => setActivePage(link.id)}
              style={{
                padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'transparent', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
                color: (activePage === link.id || (link.id === 'landing' && (activePage === 'home' || activePage === 'landing'))) ? 'var(--red-500)' : 'var(--gray-600)',
                transition: 'background var(--dur-fast), color var(--dur-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isAuth ? (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActivePage('login')}
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)' }}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setActivePage('signup')}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const r = dataService.getRole();
                  if (r === 'admin') setActivePage('admin-dashboard');
                  else if (r === 'ngo') setActivePage('ngo-dashboard');
                  else setActivePage('donor-dashboard');
                }}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Portal Dashboard
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  dataService.logout();
                  setActivePage('login');
                }}
                style={{ fontSize: 12, color: 'var(--gray-500)' }}
                title="Logout"
              >
                Logout
              </button>
            </>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage(isAuth ? 'nearby' : 'login')}
            style={{ gap: 6 }}
          >
            <MapPin size={14} />
            Donate Now
          </button>
        </div>
      </div>
    </nav>
  );
}
