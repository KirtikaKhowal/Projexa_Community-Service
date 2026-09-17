import { useState } from 'react';
import { Droplets, Share2, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export default function DonationSuccess({ onViewDonations, onShare }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleShare = () => {
    setCopied(true);
    toast.success('Link Copied!', 'Share it with friends to inspire more donations.');
    if (onShare) onShare();
    setTimeout(() => setCopied(false), 3000);
  };

  const STATS = [
    { icon: '❤️', value: 'Up to 3', label: 'Lives Saved' },
    { icon: '⭐', value: '+250 pts', label: 'Points Earned' },
    { icon: '🩸', value: '5 Total', label: 'Donations' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 24 }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <div className="card card-p" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background decorations */}
          <div style={{ position: 'absolute', top: -44, right: -44, width: 180, height: 180, background: 'var(--success-light)', borderRadius: '50%', opacity: 0.6, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -36, left: -36, width: 130, height: 130, background: 'var(--danger-light)', borderRadius: '50%', opacity: 0.4, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Success icon */}
            <div
              className="check-anim"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 88, height: 88,
                background: 'linear-gradient(135deg, var(--success), #14532D)',
                borderRadius: '50%', marginBottom: 22,
                boxShadow: '0 12px 40px rgba(22,163,74,0.3)',
              }}
              aria-hidden="true"
            >
              <CheckCircle size={44} color="white" strokeWidth={2.5} />
            </div>

            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--gray-900)', marginBottom: 10, letterSpacing: '-0.01em' }}>
              Donation Registered!
            </h1>
            <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.75, marginBottom: 28, maxWidth: 320, margin: '0 auto 28px' }}>
              Thank you for being a life saver. Your contribution can save up to{' '}
              <strong style={{ color: 'var(--red-500)' }}>3 lives</strong>.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: 'var(--gray-50)', borderRadius: 14, padding: '14px 10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gray-900)' }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 14 }} onClick={onViewDonations}>
                <Droplets size={16} /> View My Donations <ArrowRight size={14} />
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 14 }} onClick={handleShare}>
                <Share2 size={15} /> {copied ? 'Copied to Clipboard!' : 'Share this Achievement'}
              </button>
            </div>

            {/* Quote */}
            <div style={{ marginTop: 24, padding: '14px 18px', background: 'linear-gradient(135deg, var(--red-50), white)', borderRadius: 13, border: '1px solid var(--red-100)', textAlign: 'left' }}>
              <Droplets size={16} color="var(--red-500)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 13, color: 'var(--gray-600)', fontStyle: 'italic', lineHeight: 1.65 }}>
                "Every drop of blood donated is a gift of life. You are truly a hero."
              </div>
              <div style={{ fontSize: 11, color: 'var(--red-500)', fontWeight: 700, marginTop: 6 }}>— BloodConnect</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
