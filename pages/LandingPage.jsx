import { useState, useEffect } from 'react';
import { Droplets, MapPin, Heart, Users, BarChart2, ChevronRight, Play, Star, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const stats = [
  { value: '12,450', label: 'Lives Impacted', icon: Heart, color: '#DC2626' },
  { value: '8,320', label: 'Verified Donors', icon: Users, color: '#3B82F6' },
  { value: '245', label: 'Active Campaigns', icon: BarChart2, color: '#22C55E' },
  { value: '120', label: 'NGOs Supported', icon: Shield, color: '#F59E0B' },
];

const features = [
  { icon: MapPin, title: 'Find Blood Camps', desc: 'Locate nearby donation drives on an interactive real-time map with route guidance.', color: '#DC2626', bg: '#FEF2F2' },
  { icon: Heart, title: 'Donate & Track', desc: 'Register for camps, track your donation history, and see the lives you have impacted.', color: '#3B82F6', bg: '#DBEAFE' },
  { icon: Droplets, title: 'Home Collection', desc: 'Can\'t make it to a camp? Request a home collection from verified NGO volunteers.', color: '#22C55E', bg: '#DCFCE7' },
  { icon: Star, title: 'Earn Rewards', desc: 'Collect points for every action and redeem them for exclusive certificates and vouchers.', color: '#F59E0B', bg: '#FEF3C7' },
];

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'AIIMS New Delhi', text: 'BloodConnect has revolutionized how we manage blood donation camps. The platform is exceptional.', rating: 5, avatar: 'PS' },
  { name: 'Rahul Verma', role: 'Regular Donor, Delhi', text: 'I have donated 8 times through BloodConnect. The experience is seamless and rewarding!', rating: 5, avatar: 'RV' },
  { name: 'NGO Helping Hands', role: 'Verified NGO Partner', text: 'Our donation campaigns reach 10x more donors through this incredible platform.', rating: 5, avatar: 'HH' },
];

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));

  useEffect(() => {
    let start = 0;
    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return <span>{target.replace(/[0-9,]+/, count.toLocaleString())}</span>;
}

export default function LandingPage({ setActivePage }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ====== HERO ====== */}
      <section style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F9 100%)', padding: '80px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left */}
            <div style={{ animation: animated ? 'fadeInUp 0.6s ease forwards' : 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEE2E2', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
                <Droplets size={14} color="#DC2626" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Every Drop Counts</span>
              </div>

              <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                <span style={{ color: '#0F172A' }}>Together<br /></span>
                <span style={{ color: '#DC2626', position: 'relative' }}>
                  We Save Lives
                  <svg style={{ position: 'absolute', bottom: -8, left: 0, width: '100%' }} viewBox="0 0 300 12" fill="none">
                    <path d="M0 6 Q75 0 150 6 Q225 12 300 6" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
              </h1>

              <p style={{ fontSize: 17, color: '#64748B', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
                Join India's trusted blood donation community. Find donors, register, donate, and support the people who need it most. <strong style={{ color: '#0F172A' }}>Because every drop brings hope.</strong>
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                <button className="btn btn-primary btn-lg" onClick={() => setActivePage('nearby')}>
                  <MapPin size={18} /> Find Blood Camps
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => setActivePage('signup')}>
                  <Droplets size={18} /> Become a Donor
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: CheckCircle, label: 'WHO Compliant', color: '#22C55E' },
                  { icon: Shield, label: 'Verified NGOs', color: '#3B82F6' },
                  { icon: Clock, label: '24/7 Support', color: '#F59E0B' },
                ].map(b => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className="flex items-center gap-2">
                      <Icon size={16} color={b.color} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* Background blob */}
              <div style={{ position: 'absolute', width: 380, height: 380, background: 'radial-gradient(ellipse, #FEE2E2 0%, transparent 70%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

              {/* Main visual */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                {/* Blood drop SVG */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
                    <defs>
                      <radialGradient id="dropGrad" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#F87171" />
                        <stop offset="100%" stopColor="#991B1B" />
                      </radialGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="#DC2626" floodOpacity="0.25" />
                      </filter>
                    </defs>
                    {/* Blood drop shape */}
                    <path d="M140 30 C140 30 60 130 60 200 C60 251.5 95.8 290 140 290 C184.2 290 220 251.5 220 200 C220 130 140 30 140 30Z"
                      fill="url(#dropGrad)" filter="url(#shadow)" />
                    {/* Heart inside */}
                    <path d="M140 220 L108 194 C98 184 98 169 108 159 C118 149 133 149 140 159 C147 149 162 149 172 159 C182 169 182 184 172 194 Z"
                      fill="white" opacity="0.9" />
                    {/* Shine */}
                    <ellipse cx="115" cy="140" rx="14" ry="22" fill="white" opacity="0.25" transform="rotate(-20 115 140)" />
                  </svg>

                  {/* Floating handwritten text */}
                  <div style={{ position: 'absolute', top: -20, right: -60, fontFamily: 'cursive', fontSize: 18, color: '#DC2626', opacity: 0.7, transform: 'rotate(15deg)', fontStyle: 'italic', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Every Drop Counts ✨
                  </div>
                  <div style={{ position: 'absolute', bottom: 30, left: -50, fontFamily: 'cursive', fontSize: 14, color: '#3B82F6', opacity: 0.6, transform: 'rotate(-10deg)', fontStyle: 'italic' }}>
                    Save Lives 🩸
                  </div>
                </div>

                {/* Floating stat cards around visual */}
                <div style={{ position: 'absolute', top: 30, left: -80, background: 'white', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9', minWidth: 120 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626' }}>12,450+</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Lives Saved</div>
                </div>
                <div style={{ position: 'absolute', bottom: 50, right: -90, background: 'white', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9', minWidth: 130 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#22C55E' }}>Active Now</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>245 Campaigns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section style={{ background: 'white', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < stats.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={stat.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                    {animated ? <CountUp target={stat.value} /> : stat.value}
                  </div>
                  <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 6 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Platform Features</div>
            <h2 className="section-title">Everything You Need to <span style={{ color: '#DC2626' }}>Save Lives</span></h2>
            <p className="section-subtitle">A complete ecosystem for blood donation, donor management, and community support.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card" style={{ padding: '28px 24px', cursor: 'pointer', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ width: 52, height: 52, background: f.bg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{f.desc}</p>
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, color: f.color, fontSize: 13, fontWeight: 600 }}>
                    Learn more <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-title">Start Saving Lives in <span style={{ color: '#DC2626' }}>3 Simple Steps</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 40, left: '16.67%', right: '16.67%', height: 2, background: 'linear-gradient(90deg, #DC2626, #3B82F6)', zIndex: 0, opacity: 0.2 }} />
            {[
              { step: '01', title: 'Register & Verify', desc: 'Create your BloodConnect profile. Verify your identity and set your blood group and location preferences.', color: '#DC2626', bg: '#FEF2F2' },
              { step: '02', title: 'Find & Register', desc: 'Browse nearby blood camps on our live map. Register for the ones that match your availability and blood group.', color: '#3B82F6', bg: '#DBEAFE' },
              { step: '03', title: 'Donate & Earn', desc: 'Attend the camp, donate blood, and automatically earn reward points. Track your impact and celebrate milestones.', color: '#22C55E', bg: '#DCFCE7' },
            ].map(step => (
              <div key={step.step} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 80, height: 80, background: step.bg, borderRadius: '50%', border: `3px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: step.color }}>{step.step}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="section-title">Trusted by <span style={{ color: '#DC2626' }}>Thousands</span> Across India</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, i) => <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 14, background: '#FEE2E2', color: '#DC2626' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '72px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Join the Movement
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Because every drop of blood<br />is a story of <span style={{ color: '#EF4444' }}>hope</span>.
          </h2>
          <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Join 8,000+ donors who have already made a difference. Register today and start your journey to becoming a life-saver.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setActivePage('donor-dashboard')}>
              <Droplets size={18} /> Start Donating
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
              onClick={() => setActivePage('nearby')}>
              <MapPin size={18} /> Find Blood Camps
            </button>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background: '#0F172A', padding: '48px 0 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: '#DC2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>BloodConnect</div>
                  <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 600, letterSpacing: '0.05em' }}>EVERY DROP COUNTS</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8, maxWidth: 280, marginBottom: 20 }}>
                India's trusted blood donation and community support platform. Together we save lives.
              </p>
              {/* Social Icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {['f', 'in', '▶', 'X', '📷'].map((s, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#94A3B8', cursor: 'pointer', transition: 'all 0.15s ease', fontWeight: 700, fontStyle: 'italic' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94A3B8'; }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: ['Find Blood Camps', 'Become a Donor', 'Home Collection', 'Support NGOs'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = '#DC2626'}
                      onMouseLeave={e => e.target.style.color = '#64748B'}>{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#475569' }}>© 2025 BloodConnect. All rights reserved. Made with ❤️ for India.</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Donate', 'Support', 'Save Lives'].map((t, i) => (
                <span key={t}>
                  <a href="#" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#DC2626'}
                    onMouseLeave={e => e.target.style.color = '#475569'}>{t}</a>
                  {i < 2 && <span style={{ color: '#334155', margin: '0 6px' }}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
