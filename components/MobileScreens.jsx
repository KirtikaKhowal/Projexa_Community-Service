import { useState } from 'react';
import { Droplets, Search, MapPin, Calendar, Clock, Award, Bell, ChevronRight, Heart, Home, BarChart2, User, Star, Shield, Check, X } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function PhoneFrame({ children, height = 580 }) {
  return (
    <div style={{
      background: '#1a1a2e', borderRadius: 48, padding: 12, flexShrink: 0,
      boxShadow: '0 0 0 2px #2d2d4e, 0 40px 80px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.2)',
      width: 280, position: 'relative',
    }}>
      {/* Side buttons */}
      <div style={{ position: 'absolute', left: -4, top: 100, width: 4, height: 32, background: '#2d2d4e', borderRadius: '4px 0 0 4px' }} />
      <div style={{ position: 'absolute', left: -4, top: 145, width: 4, height: 50, background: '#2d2d4e', borderRadius: '4px 0 0 4px' }} />
      <div style={{ position: 'absolute', left: -4, top: 205, width: 4, height: 50, background: '#2d2d4e', borderRadius: '4px 0 0 4px' }} />
      <div style={{ position: 'absolute', right: -4, top: 150, width: 4, height: 70, background: '#2d2d4e', borderRadius: '0 4px 4px 0' }} />

      <div style={{ background: 'white', borderRadius: 38, overflow: 'hidden', height }}>
        {/* Notch */}
        <div style={{ width: 120, height: 30, background: '#1a1a2e', borderRadius: '0 0 20px 20px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 60, height: 10, background: '#0d0d1a', borderRadius: 5 }} />
        </div>
        {/* Content */}
        <div style={{ height: height - 30 - 28, overflowY: 'auto', scrollbarWidth: 'none' }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 28 }}>
          <div style={{ width: 100, height: 4, background: '#CBD5E1', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function ScreenWelcome({ onSignIn }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Top area */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #DC2626 0%, #7F1D1D 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        {/* Logo */}
        <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Droplets size={32} color="white" />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.02em' }}>BloodConnect</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: 4 }}>EVERY DROP COUNTS</div>

        {/* Community silhouettes */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 0.2, fontSize: 40 }}>
          👥 🧑‍🤝‍🧑 👥
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: -20, padding: '28px 24px 16px', zIndex: 1 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Welcome Back</h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Together we build a healthier community</p>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: 14, fontSize: 15, marginBottom: 10 }} onClick={onSignIn}>
          Login
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: 14, fontSize: 15, marginBottom: 20 }}>
          Sign Up
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ label: 'Google', icon: 'G', color: '#EA4335' }, { label: 'Apple', icon: '🍎', color: '#000' }].map(s => (
            <button key={s.label} style={{ padding: '11px', border: '1.5px solid #E2E8F0', borderRadius: 12, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: '#0F172A' }}>
              <span style={{ fontWeight: 900, color: s.color, fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenFindCamps() {
  const [filter, setFilter] = useState('Nearby');
  const camps = [
    { name: 'City Hospital Blood Camp', org: 'City Hospital, Delhi', dist: '2.5 km', date: '25 Sep', time: '9AM–4PM', slots: 76 },
    { name: 'Red Cross Camp', org: 'Indian Red Cross', dist: '6.2 km', date: '30 Sep', time: '8AM–5PM', slots: 40 },
  ];
  return (
    <div style={{ background: '#F8FAFC', height: '100%' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '12px 16px 16px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Find Blood Camps</div>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input style={{ width: '100%', padding: '9px 12px 9px 30px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', color: '#0F172A' }} placeholder="Search location, area, or camp..." />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Nearby', 'Today', 'Blood Group', 'More'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${filter === f ? '#DC2626' : '#E2E8F0'}`, background: filter === f ? '#FEF2F2' : 'white', fontSize: 10, fontWeight: 600, color: filter === f ? '#DC2626' : '#64748B', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: 160, background: 'linear-gradient(135deg, #e8f4f8, #d4eaf5)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(100,148,207,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,148,207,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        {[
          { t: 30, l: 20, c: '#DC2626' }, { t: 50, l: 55, c: '#3B82F6' },
          { t: 65, l: 75, c: '#22C55E' }, { t: 25, l: 75, c: '#DC2626' },
        ].map((m, i) => (
          <div key={i} style={{ position: 'absolute', top: `${m.t}%`, left: `${m.l}%`, width: 22, height: 22, background: m.c, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', border: '2px solid white', boxShadow: '0 3px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 8 }}>🩸</div>
          </div>
        ))}
        <div style={{ position: 'absolute', top: '45%', left: '43%', width: 14, height: 14, background: '#3B82F6', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 5px rgba(59,130,246,0.2)' }} />
      </div>

      {/* Camp Cards */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {camps.map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 14, padding: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', maxWidth: '70%' }}>{c.name}</div>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '2px 7px', borderRadius: 10 }}>Active</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>{c.org}</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {[{ icon: MapPin, val: c.dist }, { icon: Calendar, val: c.date }, { icon: Clock, val: c.time }].map((d, j) => {
                const I = d.icon;
                return <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#64748B' }}><I size={9} />{d.val}</div>;
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 600 }}>{c.slots} slots available</div>
              <button style={{ padding: '6px 14px', background: '#DC2626', color: 'white', borderRadius: 10, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Register</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenCampaignDetail() {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ background: 'white', height: '100%', overflowY: 'auto' }}>
      {/* Cover */}
      <div style={{ height: 120, background: 'linear-gradient(135deg, #DC2626, #7F1D1D)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 30 }}>🏥</div>
          <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4 }}>Blood Donation Drive</div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', flex: 1 }}>Blood Donation Drive</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}><Shield size={9} />Verified</span>
        </div>
        {[
          { icon: MapPin, val: 'AIIMS Hospital, New Delhi' },
          { icon: Calendar, val: '25 Sep 2025' },
          { icon: Clock, val: '9:00 AM – 4:00 PM' },
        ].map((d, i) => {
          const I = d.icon;
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginTop: 6 }}><I size={12} color="#DC2626" />{d.val}</div>;
        })}

        {/* Blood Groups */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Blood Groups Needed</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BLOOD_GROUPS.map(g => (
              <div key={g} style={{ width: 30, height: 30, borderRadius: '50%', background: '#FEF2F2', border: '1.5px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#DC2626' }}>{g}</div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>Slots Filled</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>124/200 (62%)</span>
          </div>
          <div style={{ height: 7, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: '62%', height: '100%', background: '#DC2626', borderRadius: 4 }} />
          </div>
        </div>

        {/* About */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>About this campaign</div>
          <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>Join this life-saving event at AIIMS Hospital. Your donation can save up to 3 lives and will be used for emergency care and surgeries.</p>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, paddingBottom: 16 }}>
          <button style={{ flex: 1, padding: '11px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Register Now
          </button>
          <button onClick={() => setSaved(!saved)} style={{ padding: '11px 13px', border: '1.5px solid #E2E8F0', borderRadius: 12, background: 'white', cursor: 'pointer' }}>
            {saved ? '🔖' : '🔖'}
          </button>
          <button style={{ padding: '11px 13px', border: '1.5px solid #E2E8F0', borderRadius: 12, background: 'white', cursor: 'pointer' }}>📤</button>
        </div>
      </div>
    </div>
  );
}

function ScreenDonorProfile() {
  const menuItems = [
    { icon: '💉', label: 'Donation History' },
    { icon: '💰', label: 'Contribution History' },
    { icon: '🏆', label: 'Certificates' },
    { icon: '⭐', label: 'Rewards' },
    { icon: '📅', label: 'Upcoming Appointments' },
  ];
  return (
    <div style={{ background: '#F8FAFC', height: '100%' }}>
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '20px 16px 30px', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: 64, height: 64, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#DC2626', margin: '0 auto 8px', border: '3px solid rgba(255,255,255,0.3)' }}>KK</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>Kirtika Khowal</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', padding: '3px 10px', borderRadius: 20 }}>🏆 Life Saver</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>⭐ 1,850 pts</span>
        </div>
      </div>

      {/* Stats Card */}
      <div style={{ margin: '-16px 14px 0', background: 'white', borderRadius: 16, padding: '14px 16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {[{ v: '4', l: 'Donations' }, { v: '8', l: 'Campaigns' }, { v: '₹1.2K', l: 'Donated' }].map((s, i) => (
          <div key={s.l} style={{ borderRight: i < 2 ? '1px solid #F1F5F9' : 'none', padding: '4px 0' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: '#64748B' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ margin: '12px 14px', background: 'white', borderRadius: 14, padding: '12px 14px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>Next Reward</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>850 pts remaining</span>
        </div>
        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '68%', height: '100%', background: '#DC2626', borderRadius: 3 }} />
        </div>
      </div>

      {/* Menu */}
      <div style={{ margin: '0 14px', background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {menuItems.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: i < menuItems.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 16 }}>{item.icon}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.label}</div>
            <ChevronRight size={14} color="#94A3B8" />
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '8px 0', marginTop: 12 }}>
        {[{ icon: Home, label: 'Home' }, { icon: BarChart2, label: 'Camps' }, { icon: Award, label: 'Rewards' }, { icon: User, label: 'Profile' }].map((n, i) => {
          const I = n.icon;
          return (
            <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
              <I size={18} color={i === 3 ? '#DC2626' : '#94A3B8'} />
              <span style={{ fontSize: 9, fontWeight: 600, color: i === 3 ? '#DC2626' : '#94A3B8' }}>{n.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileAppScreens({ setActivePage }) {
  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ color: 'white', marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 12 }}>Mobile App</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12 }}>Experience BloodConnect<br /><span style={{ color: '#EF4444' }}>On Your Phone</span></h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto' }}>A native-quality mobile experience for donors, volunteers, and NGO partners — anytime, anywhere.</p>
        </div>

        {/* Phone Mockups */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Screen 1 — Welcome */}
          <div style={{ textAlign: 'center' }}>
            <PhoneFrame height={560}>
              <ScreenWelcome onSignIn={() => setActivePage('donor-dashboard')} />
            </PhoneFrame>
            <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Welcome Screen</div>
          </div>

          {/* Screen 2 — Find Blood Camps (elevated) */}
          <div style={{ textAlign: 'center', transform: 'translateY(-24px)' }}>
            <PhoneFrame height={580}>
              <ScreenFindCamps />
            </PhoneFrame>
            <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Find Blood Camps</div>
          </div>

          {/* Screen 3 — Campaign Detail */}
          <div style={{ textAlign: 'center' }}>
            <PhoneFrame height={560}>
              <ScreenCampaignDetail />
            </PhoneFrame>
            <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Campaign Details</div>
          </div>

          {/* Screen 4 — Donor Profile (elevated) */}
          <div style={{ textAlign: 'center', transform: 'translateY(-12px)' }}>
            <PhoneFrame height={570}>
              <ScreenDonorProfile />
            </PhoneFrame>
            <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Donor Profile</div>
          </div>
        </div>

        {/* Download CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 16 }}>Available on iOS and Android</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🍎', label: 'App Store', sub: 'Download on the' },
              { icon: '▶', label: 'Google Play', sub: 'Get it on' },
            ].map(store => (
              <div key={store.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px 20px', cursor: 'pointer', transition: 'all 0.15s ease', backdropFilter: 'blur(10px)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <div style={{ fontSize: 28 }}>{store.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{store.sub}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{store.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
