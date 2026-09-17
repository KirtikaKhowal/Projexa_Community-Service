import { useState, useEffect } from 'react';
import {
  Search, MapPin, Calendar, Clock, Users, ChevronRight, Droplets,
  Shield, Navigation, ExternalLink, List, Map, Filter, RefreshCw,
  AlertCircle, Phone, MessageSquare, CheckCircle2, Compass, Copy,
  X, Car, Award, Sparkles, Building2, Layers
} from 'lucide-react';
import { dataService } from '../services/dataService';
import CampMap from '../components/CampMap';
import DonationRegistrationModal from '../components/DonationRegistrationModal';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = ['All', 'New Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata'];
const RADIUS_OPTIONS = [
  { label: 'Any Distance', value: 'all' },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 25 km', value: 25 },
  { label: 'Within 50 km', value: 50 },
];

const POPULAR_AREAS = [
  { label: 'Rohini (North Delhi)', lat: 28.7118, lng: 77.1264, city: 'New Delhi' },
  { label: 'Connaught Place', lat: 28.6315, lng: 77.2167, city: 'New Delhi' },
  { label: 'AIIMS / South Delhi', lat: 28.5672, lng: 77.2100, city: 'New Delhi' },
  { label: 'Dwarka', lat: 28.5888, lng: 77.0425, city: 'New Delhi' },
  { label: 'Noida Sec-62', lat: 28.6258, lng: 77.3688, city: 'Noida' },
  { label: 'Gurgaon CyberHub', lat: 28.4952, lng: 77.0895, city: 'Gurgaon' },
  { label: 'Mumbai (Bandra/BKC)', lat: 19.0607, lng: 72.8362, city: 'Mumbai' },
  { label: 'Bengaluru (Indiranagar)', lat: 12.9784, lng: 77.6408, city: 'Bengaluru' },
];

export default function NearbyBloodCamps() {
  const [camps, setCamps] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRadius, setSelectedRadius] = useState('all');

  // User Location State
  const [userLocation, setUserLocation] = useState({
    lat: 28.7118, // Default to user's Rohini, Delhi location
    lng: 77.1264,
    label: 'Rohini, Delhi (Default)',
    isLiveGps: false,
  });
  const [locating, setLocating] = useState(false);

  // Modals & Detail State
  const [activeCampDetail, setActiveCampDetail] = useState(null);
  const [campToRegister, setCampToRegister] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const sync = () => setCamps(dataService.getCamps());
    sync();
    return dataService.subscribe(sync);
  }, []);

  // Browser Geolocation trigger
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('GPS Not Supported', 'Your browser does not support automatic location detection.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'My Exact GPS Location',
          isLiveGps: true,
        });
        setLocating(false);
        toast.success('Live Location Detected', 'Sorted blood donation camps closest to your current coordinates.');
      },
      (err) => {
        setLocating(false);
        toast.warning('GPS Notice', 'Location permission denied or unavailable. Using Rohini, Delhi as your active anchor.');
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  // Quick area preset selection
  const handleSelectAreaPreset = (area) => {
    setUserLocation({
      lat: area.lat,
      lng: area.lng,
      label: area.label,
      isLiveGps: false,
    });
    if (selectedCity !== 'All' && selectedCity !== area.city) {
      setSelectedCity(area.city);
    }
    toast.info('Location Switched', `Showing camps nearest to ${area.label}.`);
  };

  // Haversine formula for exact distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Estimated driving time calculation
  const getDrivingEta = (distKm) => {
    if (!distKm) return null;
    const km = parseFloat(distKm);
    if (km < 0.8) return '~2 mins drive';
    const minutes = Math.round(km * 2.4 + 4);
    if (minutes > 60) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `~${hrs}h ${mins}m drive`;
    }
    return `~${minutes} mins drive`;
  };

  // Filtering and nearest sorting
  const filteredCamps = camps
    .filter(camp => {
      if (selectedCity !== 'All' && camp.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedGroup !== 'All') {
        const matches = camp.bloodGroupsNeeded.includes('All Groups') || camp.bloodGroupsNeeded.includes(selectedGroup);
        if (!matches) return false;
      }
      if (selectedStatus !== 'All' && camp.status !== selectedStatus) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = camp.name.toLowerCase().includes(q);
        const matchesAddress = camp.address.toLowerCase().includes(q);
        const matchesNgo = camp.ngoName.toLowerCase().includes(q);
        const matchesArea = (camp.area || '').toLowerCase().includes(q);
        const matchesLandmark = (camp.landmark || '').toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesNgo && !matchesArea && !matchesLandmark) return false;
      }

      // Radius filter
      if (selectedRadius !== 'all' && userLocation) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, camp.lat, camp.lng);
        if (dist && parseFloat(dist) > Number(selectedRadius)) return false;
      }

      return true;
    })
    .map(camp => {
      const dist = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, camp.lat, camp.lng)
        : null;
      return {
        ...camp,
        calculatedDistance: dist,
        drivingEta: getDrivingEta(dist),
      };
    })
    .sort((a, b) => {
      if (a.calculatedDistance && b.calculatedDistance) {
        return parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance);
      }
      return 0;
    });

  // Google Maps Turn-by-Turn Navigation Launcher
  const openGoogleMapsDirections = (camp) => {
    if (!camp) return;
    let url;
    if (userLocation && userLocation.lat && userLocation.lng) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${camp.lat},${camp.lng}&travelmode=driving`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${camp.lat},${camp.lng}&travelmode=driving`;
    }
    window.open(url, '_blank');
  };

  // Google Maps Place Search Launcher
  const openGoogleMapsPlace = (camp) => {
    if (!camp) return;
    const query = encodeURIComponent(`${camp.name}, ${camp.address}, ${camp.city}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  // Copy full address
  const copyAddress = (camp) => {
    if (!camp) return;
    const fullText = `${camp.name}\n${camp.address}, ${camp.city}${camp.pincode ? ' - ' + camp.pincode : ''}\nLandmark: ${camp.landmark || 'N/A'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        toast.success('Address Copied!', 'Full address and landmark copied to clipboard.');
      }).catch(() => {
        toast.info('Address', fullText);
      });
    } else {
      toast.info('Address', fullText);
    }
  };

  const handleOpenRegister = (camp) => {
    setCampToRegister(camp);
    setIsRegisterOpen(true);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)',
        border: '1px solid #FFE4E6',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#B91C1C', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
            <Compass size={14} className="animate-spin-slow" />
            <span>GPS-ENABLED BLOOD CAMP FINDER</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--gray-900)', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
            Nearby Blood Donation Camps
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: 14, margin: 0, maxWidth: 640 }}>
            Find certified donation drives around you with live seat availability, verified contact numbers, and <strong>direct Google Maps turn-by-turn navigation</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* GPS button */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={requestLocation}
            disabled={locating}
            style={{
              gap: 8,
              background: userLocation?.isLiveGps ? '#FEF2F2' : 'white',
              borderColor: userLocation?.isLiveGps ? 'var(--red-500)' : 'var(--border)',
              color: userLocation?.isLiveGps ? 'var(--red-600)' : 'var(--gray-800)',
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            <Navigation size={15} color="var(--red-500)" />
            {locating ? 'Detecting GPS...' : userLocation?.isLiveGps ? 'Live GPS Active' : 'Detect My Location'}
          </button>

          {/* List / Map View Switcher */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('list')}
              style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 700 }}
            >
              <List size={15} /> List
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('map')}
              style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 700 }}
            >
              <Map size={15} /> Map View
            </button>
          </div>
        </div>
      </div>

      {/* Quick Location Anchor Bar */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '12px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>
          <MapPin size={16} color="var(--red-500)" />
          <span>Current Anchor:</span>
          <span style={{ color: 'var(--red-600)', background: '#FEE2E2', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>
            {userLocation.label}
          </span>
        </div>

        <div style={{ height: 18, width: 1, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2, flex: 1 }}>
          <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, whiteSpace: 'nowrap' }}>Quick Areas:</span>
          {POPULAR_AREAS.map(area => {
            const isActive = userLocation.label === area.label;
            return (
              <button
                key={area.label}
                type="button"
                onClick={() => handleSelectAreaPreset(area)}
                style={{
                  border: isActive ? '1px solid var(--red-500)' : '1px solid var(--border)',
                  background: isActive ? '#FEF2F2' : '#F8FAFC',
                  color: isActive ? 'var(--red-700)' : 'var(--gray-700)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 11.5,
                  padding: '4px 10px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {area.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: 18, marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search camp, hospital, landmark..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              className="form-input"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : `City: ${c}`}</option>
              ))}
            </select>
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg === 'All' ? 'All Blood Groups' : `Needed: ${bg}`}</option>
              ))}
            </select>
          </div>

          {/* Radius Filter */}
          <div>
            <select
              className="form-input"
              value={selectedRadius}
              onChange={e => setSelectedRadius(e.target.value)}
            >
              {RADIUS_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-input"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Almost Full">Almost Full</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: MAP VIEW */}
      {viewMode === 'map' && (
        <div style={{ marginBottom: 30 }}>
          <CampMap
            camps={filteredCamps}
            userLocation={userLocation}
            onSelectCamp={camp => setActiveCampDetail(camp)}
            onRegisterCamp={camp => handleOpenRegister(camp)}
          />
        </div>
      )}

      {/* VIEW: LIST VIEW */}
      {viewMode === 'list' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-600)' }}>
              Showing {filteredCamps.length} verified camps sorted by distance
            </span>
            {(search || selectedCity !== 'All' || selectedGroup !== 'All' || selectedStatus !== 'All' || selectedRadius !== 'all') && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCity('All');
                  setSelectedGroup('All');
                  setSelectedStatus('All');
                  setSelectedRadius('all');
                }}
                style={{ fontSize: 12, color: 'var(--red-600)', padding: '4px 8px' }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredCamps.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No Blood Camps Found Nearby"
              description="No active blood donation drives match your current search and radius criteria. Try widening the radius or selecting 'All Cities'."
              actionLabel="Reset Filters"
              onAction={() => {
                setSelectedCity('All');
                setSelectedGroup('All');
                setSelectedStatus('All');
                setSelectedRadius('all');
                setSearch('');
              }}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {filteredCamps.map(camp => {
                const isAlmostFull = camp.status === 'Almost Full';
                const isFull = camp.status === 'Full';
                const remaining = Math.max(0, camp.totalSeats - camp.registeredCount);

                return (
                  <div
                    key={camp.id}
                    className="card"
                    style={{
                      padding: 22,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderTop: isFull ? '4px solid var(--gray-400)' : isAlmostFull ? '4px solid #F59E0B' : '4px solid var(--red-500)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div>
                      {/* Top Header: Distance Badge & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className={`badge ${isFull ? 'badge-neutral' : isAlmostFull ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: 11.5 }}>
                          {camp.status}
                        </span>

                        {camp.calculatedDistance && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#FEF2F2',
                            color: '#DC2626',
                            padding: '3px 9px',
                            borderRadius: 14,
                            fontSize: 12,
                            fontWeight: 800,
                            border: '1px solid #FEE2E2'
                          }}>
                            <Navigation size={12} />
                            <span>{camp.calculatedDistance} km</span>
                            {camp.drivingEta && (
                              <span style={{ color: '#991B1B', fontWeight: 600, fontSize: 11 }}>
                                · {camp.drivingEta}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title & Organizer */}
                      <h3
                        onClick={() => setActiveCampDetail(camp)}
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: 'var(--gray-900)',
                          lineHeight: 1.3,
                          marginBottom: 4,
                          cursor: 'pointer'
                        }}
                      >
                        {camp.name}
                      </h3>
                      <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={13} color="var(--gray-400)" />
                        <span>Organized by <strong style={{ color: 'var(--gray-800)' }}>{camp.ngoName}</strong></span>
                      </div>

                      {/* Location & Landmark */}
                      <div style={{
                        background: '#F8FAFC',
                        borderRadius: 10,
                        padding: '10px 12px',
                        marginBottom: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        border: '1px solid #EDF2F7'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: 'var(--gray-700)' }}>
                          <MapPin size={14} color="var(--red-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <span style={{ fontWeight: 600 }}>{camp.address}, {camp.city}</span>
                            {camp.landmark && (
                              <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 2 }}>
                                📍 <em>Landmark: {camp.landmark}</em>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--gray-600)', paddingTop: 4, borderTop: '1px dashed #E2E8F0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={13} color="var(--gray-400)" /> {camp.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} color="var(--gray-400)" /> {camp.time}
                          </span>
                        </div>
                      </div>

                      {/* Blood Groups Urgent Tags */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                          Urgent Needs:
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {camp.bloodGroupsNeeded.map(g => (
                            <span
                              key={g}
                              style={{
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: '#FEF2F2',
                                color: '#B91C1C',
                                fontSize: 11,
                                fontWeight: 800,
                                border: '1px solid #FECACA'
                              }}
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Seats Capacity Meter */}
                      <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 10, marginBottom: 18, border: '1px solid #EDF2F7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                          <span style={{ color: 'var(--gray-600)' }}>Capacity:</span>
                          <span style={{ color: 'var(--red-600)' }}>{camp.registeredCount} / {camp.totalSeats} ({remaining} seats left)</span>
                        </div>
                        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              background: isAlmostFull ? '#F59E0B' : 'var(--red-500)',
                              width: `${Math.min(100, (camp.registeredCount / camp.totalSeats) * 100)}%`,
                              borderRadius: 3
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      {/* Navigation & Details Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => openGoogleMapsDirections(camp)}
                          style={{
                            gap: 6,
                            justifyContent: 'center',
                            borderColor: '#2563EB',
                            color: '#1D4ED8',
                            background: '#EFF6FF',
                            fontWeight: 700,
                            fontSize: 12
                          }}
                          title="Open turn-by-turn navigation in Google Maps"
                        >
                          <Navigation size={13} color="#2563EB" /> Navigate (Maps)
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setActiveCampDetail(camp)}
                          style={{ gap: 6, justifyContent: 'center', fontWeight: 600, fontSize: 12 }}
                        >
                          <Map size={13} /> View Map & Info
                        </button>
                      </div>

                      {/* Register Button */}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={isFull}
                        onClick={() => handleOpenRegister(camp)}
                        style={{ width: '100%', fontWeight: 700 }}
                      >
                        {isFull ? 'Camp Full' : 'Register to Donate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Detailed Camp Modal with Live Google Maps Embed */}
      {activeCampDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setActiveCampDetail(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 10,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="badge badge-danger" style={{ fontSize: 11 }}>
                    {activeCampDetail.status}
                  </span>
                  {activeCampDetail.calculatedDistance && (
                    <span style={{ fontSize: 12, color: 'var(--red-600)', fontWeight: 800 }}>
                      📍 {activeCampDetail.calculatedDistance} km from your anchor
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--gray-900)', margin: 0, lineHeight: 1.25 }}>
                  {activeCampDetail.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', margin: '4px 0 0' }}>
                  Organized by <strong>{activeCampDetail.ngoName}</strong>
                </p>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveCampDetail(null)}
                style={{ padding: 6, borderRadius: '50%', color: 'var(--gray-500)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* Google Maps Live Interactive Embed */}
              <div style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                marginBottom: 20,
                position: 'relative',
                background: '#F1F5F9'
              }}>
                <iframe
                  title="Google Maps Location Preview"
                  width="100%"
                  height="260"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${activeCampDetail.lat},${activeCampDetail.lng}&hl=en&z=15&output=embed`}
                />

                {/* Floating Map Navigation Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  gap: 8,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 12px',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-700)', fontWeight: 700 }}>
                    Coordinates: {activeCampDetail.lat.toFixed(4)}, {activeCampDetail.lng.toFixed(4)}
                  </div>
                  <button
                    type="button"
                    onClick={() => openGoogleMapsDirections(activeCampDetail)}
                    style={{
                      background: '#1E40AF',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                  >
                    <Navigation size={12} /> Open Full Turn-by-Turn GPS
                  </button>
                </div>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => openGoogleMapsDirections(activeCampDetail)}
                  style={{ gap: 6, justifyContent: 'center', background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8', fontWeight: 700 }}
                >
                  <Navigation size={14} color="#1D4ED8" /> Google Maps
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => copyAddress(activeCampDetail)}
                  style={{ gap: 6, justifyContent: 'center' }}
                >
                  <Copy size={14} /> Copy Address
                </button>

                {activeCampDetail.contactPhone && (
                  <a
                    href={`tel:${activeCampDetail.contactPhone}`}
                    className="btn btn-outline btn-sm"
                    style={{ gap: 6, justifyContent: 'center', textDecoration: 'none', color: 'var(--gray-800)' }}
                  >
                    <Phone size={14} color="var(--red-500)" /> Call Lead
                  </a>
                )}

                {activeCampDetail.contactPhone && (
                  <a
                    href={`https://wa.me/${activeCampDetail.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I want to inquire about the ${activeCampDetail.name} blood donation camp.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ gap: 6, justifyContent: 'center', textDecoration: 'none', color: '#15803D', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                  >
                    <MessageSquare size={14} color="#15803D" /> WhatsApp
                  </a>
                )}
              </div>

              {/* Complete Address & Landmarks */}
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={15} color="var(--red-500)" /> Full Venue & Navigation Details
                </h4>
                <div style={{ fontSize: 13.5, color: 'var(--gray-800)', lineHeight: 1.5, marginBottom: 6 }}>
                  <strong>Address:</strong> {activeCampDetail.address}, {activeCampDetail.city} {activeCampDetail.pincode ? `(${activeCampDetail.pincode})` : ''}
                </div>
                {activeCampDetail.landmark && (
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 6 }}>
                    <strong>Nearby Landmark:</strong> {activeCampDetail.landmark}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-700)', marginTop: 10, paddingTop: 10, borderTop: '1px solid #E2E8F0' }}>
                  <span>📅 <strong>Date:</strong> {activeCampDetail.date}</span>
                  <span>⏰ <strong>Timing:</strong> {activeCampDetail.time}</span>
                  {activeCampDetail.coordinator && (
                    <span>👤 <strong>Coordinator:</strong> {activeCampDetail.coordinator}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {activeCampDetail.description && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 6 }}>About This Drive</h4>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>
                    {activeCampDetail.description}
                  </p>
                </div>
              )}

              {/* Facilities Checklist */}
              {activeCampDetail.facilities && activeCampDetail.facilities.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} color="#F59E0B" /> Verified Camp Amenities & Medical Facilities
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    {activeCampDetail.facilities.map(facility => (
                      <div key={facility} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--gray-700)' }}>
                        <CheckCircle2 size={15} color="#16A34A" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blood Groups Needed */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 8 }}>Priority Blood Groups Needed</h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeCampDetail.bloodGroupsNeeded.map(g => (
                    <span
                      key={g}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: '#FEF2F2',
                        color: '#B91C1C',
                        fontSize: 12,
                        fontWeight: 800,
                        border: '1px solid #FECACA'
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA in Modal */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openGoogleMapsDirections(activeCampDetail)}
                  style={{ flex: 1, gap: 6, justifyContent: 'center' }}
                >
                  <Navigation size={16} /> Start Google Maps
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={activeCampDetail.status === 'Full'}
                  onClick={() => {
                    handleOpenRegister(activeCampDetail);
                    setActiveCampDetail(null);
                  }}
                  style={{ flex: 1.2, fontWeight: 800 }}
                >
                  {activeCampDetail.status === 'Full' ? 'Camp Full' : 'Register for this Camp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
        <DonationRegistrationModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          preselectedCamp={campToRegister}
          onSuccess={() => {
            setCamps(dataService.getCamps());
          }}
        />
      )}
    </div>
  );
}
