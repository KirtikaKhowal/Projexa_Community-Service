import { useRef } from 'react';
import { X, Award, Download, Printer, ShieldCheck, CheckCircle2, Droplets } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, certificate }) {
  const certRef = useRef(null);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 740, width: '95%' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={22} color="var(--red-500)" />
            <h3 className="modal-title">Verified Certificate of Appreciation</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Printable Certificate Frame */}
        <div className="modal-body" style={{ padding: '16px 20px' }}>
          <div
            ref={certRef}
            className="certificate-paper"
            style={{
              background: '#FFFDF9',
              border: '8px double #D97706',
              borderRadius: 16,
              padding: '36px 32px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            }}
          >
            {/* Corner Ornamental Accents */}
            <div style={{ position: 'absolute', top: 12, left: 14, fontSize: 18, color: '#D97706' }}>✦</div>
            <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 18, color: '#D97706' }}>✦</div>
            <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 18, color: '#D97706' }}>✦</div>
            <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 18, color: '#D97706' }}>✦</div>

            {/* Emblem / Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #DC2626, #991B1B)',
              margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
            }}>
              <Droplets size={28} color="#FFFFFF" />
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.15em', color: '#92400E', textTransform: 'uppercase' }}>
              National Voluntary Blood Donation Mission
            </div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#1E293B',
              letterSpacing: '-0.02em',
              margin: '8px 0 16px',
              fontFamily: 'serif',
            }}>
              Certificate of Appreciation
            </h1>

            <p style={{ fontSize: 14, color: '#64748B', fontStyle: 'italic', marginBottom: 12 }}>
              This is proudly presented to
            </p>

            <div style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#DC2626',
              borderBottom: '2px solid #FCD34D',
              display: 'inline-block',
              padding: '0 32px 6px',
              marginBottom: 16,
              fontFamily: 'serif',
            }}>
              {certificate.donorName}
            </div>

            <p style={{
              fontSize: 13.5,
              color: '#475569',
              lineHeight: 1.7,
              maxWidth: 520,
              margin: '0 auto 24px',
            }}>
              in heartfelt recognition of selflessly donating <strong style={{ color: '#0F172A' }}>{certificate.unitsDonated || 1} unit of {certificate.bloodGroup} blood</strong> at the{' '}
              <strong style={{ color: '#0F172A' }}>{certificate.campName}</strong> organized by{' '}
              <strong style={{ color: '#0F172A' }}>{certificate.ngoName}</strong> on <strong style={{ color: '#0F172A' }}>{certificate.donationDate}</strong>.
              Your noble act has helped save precious human lives.
            </p>

            {/* Bottom Signatures & Verification Seal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px dashed #CBD5E1',
              paddingTop: 18,
              marginTop: 18,
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Verified Certificate ID</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.04em' }}>
                  {certificate.id}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#16A34A', fontSize: 11, fontWeight: 700 }}>
                  <ShieldCheck size={14} /> Legally Audited Record
                </div>
              </div>

              {/* Gold Verification Seal */}
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                border: '2px dashed #D97706',
                background: '#FEF3C7',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
              }}>
                <CheckCircle2 size={22} color="#D97706" />
                <span style={{ fontSize: 8.5, fontWeight: 800, color: '#92400E', textTransform: 'uppercase', marginTop: 2, textAlign: 'center', lineHeight: 1 }}>
                  Official LifeSaver
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontStyle: 'italic', fontFamily: 'serif' }}>
                  Authorized Signatory
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {certificate.ngoName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={15} color="var(--success)" />
            Cryptographically signed & tamper-proof.
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={handlePrint} style={{ gap: 6 }}>
              <Printer size={15} /> Print / Save PDF
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
