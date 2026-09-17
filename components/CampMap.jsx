import { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, ExternalLink, Droplets, Users, Layers, Map as MapIcon, Compass } from 'lucide-react';

export default function CampMap({ camps = [], userLocation = null, onSelectCamp, onRegisterCamp }) {
  const [activeCamp, setActiveCamp] = useState(camps[0] || null);
  const [mapType, setMapType] = useState('google'); // 'google' | 'radar'

  // Map coordinates projection for India bounds approx (68°E to 97°E, 8°N to 36°N)
  // Projected to SVG 800 x 600
  const projectCoords = (lat, lng) => {
    const minLat = 8.0, maxLat = 35.5;
    const minLng = 68.0, maxLng = 92.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = 570 - ((lat - minLat) / (maxLat - minLat)) * 540;
    return { x, y };
  };

  const openDirections = (camp) => {
    if (!camp) return;
    let url;
    if (userLocation && userLocation.lat && userLocation.lng) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${camp.lat},${camp.lng}&travelmode=driving`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${camp.lat},${camp.lng}&travelmode=driving`;
    }
    window.open(url, '_blank');
  };

  const currentCamp = activeCamp || camps[0] || null;

  return (
    <div className="camp-map-container" style={{
      position: 'relative',
      background: '#F8FAFC',
      borderRadius: 20,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      minHeight: 560,
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Top Map Bar: Counts & Mode Switcher */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        pointerEvents: 'none'
      }}>
        {/* Active camps badge */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          padding: '8px 14px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red-500)', boxShadow: '0 0 0 4px rgba(220,38,38,0.2)' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-900)' }}>
            {camps.length} Donation Camps Loaded
          </span>
          {userLocation?.label && (
            <span style={{ fontSize: 11.5, color: 'var(--gray-500)', borderLeft: '1px solid #CBD5E1', paddingLeft: 8 }}>
              From: <strong>{userLocation.label}</strong>
            </span>
          )}
        </div>

        {/* View Toggle (Google Maps Live vs Visual Radar) */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          padding: 3,
          border: '1px solid var(--border)',
          display: 'flex',
          gap: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <button
            type="button"
            className={`btn btn-sm ${mapType === 'google' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMapType('google')}
            style={{ padding: '5px 12px', fontSize: 12, borderRadius: 8, fontWeight: 700 }}
          >
            <MapIcon size={14} /> Live Google Maps
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mapType === 'radar' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMapType('radar')}
            style={{ padding: '5px 12px', fontSize: 12, borderRadius: 8, fontWeight: 700 }}
          >
            <Compass size={14} /> Radar Pins
          </button>
        </div>
      </div>

      {/* VIEW: LIVE GOOGLE MAPS EMBED */}
      {mapType === 'google' && (
        <div style={{ width: '100%', height: 580, position: 'relative' }}>
          {currentCamp ? (
            <iframe
              title="Google Maps Interactive View"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: 580 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${currentCamp.lat},${currentCamp.lng}&hl=en&z=14&output=embed`}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)' }}>
              Select a camp to preview on Google Maps
            </div>
          )}
        </div>
      )}

      {/* VIEW: RADAR SVG VIEW */}
      {mapType === 'radar' && (
        <svg
          viewBox="0 0 800 600"
          style={{ width: '100%', height: '100%', minHeight: 580, display: 'block', background: 'radial-gradient(ellipse at 50% 50%, #F8FAFC 0%, #EDF2F7 100%)' }}
        >
          <defs>
            <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="rgba(203, 213, 225, 0.45)" strokeWidth="1" strokeDasharray="4 6">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="250" y1="0" x2="250" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="550" y1="0" x2="550" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />

            <line x1="0" y1="120" x2="800" y2="120" />
            <line x1="0" y1="240" x2="800" y2="240" />
            <line x1="0" y1="360" x2="800" y2="360" />
            <line x1="0" y1="480" x2="800" y2="480" />
          </g>

          {/* Region Labels */}
          <text x="320" y="140" fill="#94A3B8" fontSize="13" fontWeight="700" letterSpacing="0.08em">NORTH / DELHI NCR</text>
          <text x="190" y="320" fill="#94A3B8" fontSize="13" fontWeight="700" letterSpacing="0.08em">WEST / MUMBAI & PUNE</text>
          <text x="340" y="470" fill="#94A3B8" fontSize="13" fontWeight="700" letterSpacing="0.08em">SOUTH / BENGALURU & HYDERABAD</text>

          {/* Camps Markers */}
          {camps.map(camp => {
            const { x, y } = projectCoords(camp.lat, camp.lng);
            const isSelected = currentCamp?.id === camp.id;

            return (
              <g
                key={camp.id}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => setActiveCamp(camp)}
              >
                {/* Pulsing ring */}
                <circle r={isSelected ? "28" : "16"} fill="url(#pinGlow)">
                  <animate
                    attributeName="r"
                    values={isSelected ? "22;32;22" : "14;22;14"}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Pin base circle */}
                <circle
                  r={isSelected ? "14" : "10"}
                  fill={isSelected ? "var(--red-500)" : "#E11D48"}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))"
                />

                <circle r="4" fill="#FFFFFF" />

                {/* Camp Label */}
                <rect
                  x="14"
                  y="-13"
                  width={Math.min(220, camp.name.length * 6.5 + 24)}
                  height="22"
                  rx="6"
                  fill={isSelected ? "#0F172A" : "white"}
                  stroke={isSelected ? "#0F172A" : "var(--border)"}
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                />
                <text
                  x="22"
                  y="2"
                  fill={isSelected ? "#FFFFFF" : "#1E293B"}
                  fontSize="11"
                  fontWeight="700"
                >
                  {camp.city} · {camp.registeredCount}/{camp.totalSeats}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Selected Camp Floating Bottom Card */}
      {currentCamp && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          maxWidth: 480,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid var(--border)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
          zIndex: 30,
          animation: 'fadeInUp 0.3s ease',
        }}>
          {/* Top Status & Distance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span className="badge badge-danger" style={{ fontSize: 11 }}>
                  {currentCamp.status}
                </span>
                {currentCamp.calculatedDistance && (
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '2px 7px', borderRadius: 10 }}>
                    📍 {currentCamp.calculatedDistance} km ({currentCamp.drivingEta || '~mins'})
                  </span>
                )}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.25, margin: 0 }}>
                {currentCamp.name}
              </h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>Available Seats</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--red-600)' }}>
                {currentCamp.registeredCount} / {currentCamp.totalSeats}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={13} color="var(--red-500)" style={{ flexShrink: 0 }} />
            <span>{currentCamp.address}, {currentCamp.city}</span>
          </div>

          {currentCamp.landmark && (
            <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginBottom: 8, paddingLeft: 18 }}>
              📍 <em>Landmark: {currentCamp.landmark}</em>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--gray-600)', marginBottom: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} color="var(--gray-400)" /> {currentCamp.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} color="var(--gray-400)" /> {currentCamp.time}
            </span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => openDirections(currentCamp)}
              style={{ flex: 1.2, gap: 6, justifyContent: 'center', background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8', fontWeight: 700 }}
              title="Open Google Maps Turn-by-Turn GPS Navigation"
            >
              <Navigation size={13} color="#1D4ED8" /> Navigate (Maps)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onSelectCamp && onSelectCamp(currentCamp)}
              style={{ flex: 1, gap: 5, justifyContent: 'center' }}
            >
              Full Info
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={currentCamp.status === 'Full'}
              onClick={() => onRegisterCamp && onRegisterCamp(currentCamp)}
              style={{ flex: 1, fontWeight: 700 }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
