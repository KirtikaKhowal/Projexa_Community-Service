import { useState, useEffect } from 'react';
import {
  Award, ShieldCheck, Download, Printer, Eye, CheckCircle2,
  Calendar, Droplets, ArrowRight, ExternalLink
} from 'lucide-react';
import { dataService } from '../services/dataService';
import CertificateModal from '../components/CertificateModal';
import { EmptyState } from '../components/ui/EmptyState';

export default function CertificatesPage({ setActivePage }) {
  const [certificates, setCertificates] = useState([]);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    const sync = () => setCertificates(dataService.getCertificates());
    sync();
    return dataService.subscribe(sync);
  }, []);

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={26} color="var(--red-500)" />
            My Verified Certificates
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
            Official digital recognition for completed voluntary donations. Verified by accredited Indian blood banks.
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setActivePage && setActivePage('registrations')}
        >
          Check Donation Status
        </button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Available Yet"
          description="Certificates are cryptographically generated and issued as soon as your voluntary donation is verified and marked complete at a registered camp."
          actionLabel="Find a Donation Camp"
          onAction={() => setActivePage && setActivePage('nearby')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)',
                border: '1.5px solid #FDE68A',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                {/* Certificate Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ShieldCheck size={13} color="#92400E" /> Verified LifeSaver
                  </span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: 'var(--red-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                    color: 'var(--red-600)', fontSize: 14
                  }}>
                    {cert.bloodGroup}
                  </div>
                </div>

                <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  National Blood Mission
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', marginTop: 2, marginBottom: 8 }}>
                  {cert.campName}
                </h3>

                <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
                  Issued to <strong style={{ color: 'var(--gray-900)' }}>{cert.donorName}</strong> on {cert.donationDate}.
                </div>

                {/* Verification ID Pill */}
                <div style={{
                  background: 'var(--gray-50)',
                  border: '1px solid var(--border)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  color: 'var(--gray-600)',
                  marginBottom: 16,
                }}>
                  <div>Ref ID: <strong style={{ color: 'var(--gray-800)' }}>{cert.id}</strong></div>
                  <div style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <CheckCircle2 size={12} /> Authenticity Audited
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveCert(cert)}
                  style={{ flex: 1, gap: 5 }}
                >
                  <Eye size={14} /> View & Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          certificate={activeCert}
        />
      )}
    </div>
  );
}
