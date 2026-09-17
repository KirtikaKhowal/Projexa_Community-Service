import { useState, useEffect } from 'react';
import {
  X, Check, ChevronRight, ChevronLeft, MapPin, Calendar, Clock,
  ShieldCheck, AlertCircle, Heart, User, Phone, CheckCircle, ExternalLink,
  Droplets, Sparkles, Navigation
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from './ui/Toast';

const TIME_SLOTS = [
  '09:30 AM - 10:30 AM',
  '10:30 AM - 11:30 AM',
  '11:30 AM - 12:30 PM',
  '01:30 PM - 02:30 PM',
  '02:30 PM - 03:30 PM',
  '03:30 PM - 04:30 PM',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonationRegistrationModal({ isOpen, onClose, preselectedCamp, onSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [availableCamps, setAvailableCamps] = useState([]);
  
  // Step 1: Personal Info
  const [fullName, setFullName] = useState('Kirtika Khowal');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Female');

  // Step 2: Blood Group
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Step 3: Eligibility Questions
  const [eligibility, setEligibility] = useState({
    weightOk: true, // >= 45 kg
    ageOk: true,    // 18 - 65
    gapOk: true,    // Haven't donated in past 90 days
    healthyToday: true,
    noSurgeryTattoo: true,
  });

  // Step 4: Preferred Date & Time
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);

  // Step 6: Created Registration
  const [createdReg, setCreatedReg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const camps = dataService.getCamps();
      setAvailableCamps(camps);
      const campToUse = preselectedCamp || camps[0] || null;
      setSelectedCamp(campToUse);
      if (campToUse) {
        setPreferredDate(campToUse.date);
      }
      setStep(1);
      setCreatedReg(null);
    }
  }, [isOpen, preselectedCamp]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !age) {
        toast.warning('Required Information', 'Please provide your full name, phone number, and age.');
        return;
      }
      if (parseInt(age) < 18 || parseInt(age) > 65) {
        toast.error('Age Requirement', 'Blood donors must generally be between 18 and 65 years of age.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!bloodGroup) {
        toast.warning('Select Blood Group', 'Please choose your blood group to continue.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!eligibility.weightOk || !eligibility.healthyToday || !eligibility.noSurgeryTattoo) {
        toast.error('Eligibility Notice', 'You may not currently meet basic donor criteria. Qualified medical staff will conduct the final check.');
      }
      setStep(4);
    } else if (step === 4) {
      if (!preferredDate || !timeSlot) {
        toast.warning('Date & Time', 'Please select a preferred date and time slot.');
        return;
      }
      setStep(5);
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedCamp) {
      toast.error('No Camp Selected', 'Please select a donation camp.');
      return;
    }
    setSubmitting(true);
    try {
      const reg = dataService.registerForCamp({
        campId: selectedCamp.id,
        donorName: fullName,
        donorPhone: phone,
        bloodGroup,
        preferredDate,
        timeSlot,
      });
      setCreatedReg(reg);
      setStep(6);
      toast.success('Registration Confirmed! 🎉', `Reference: ${reg.id}. +100 Points earned!`);
      if (onSuccess) onSuccess(reg);
    } catch (err) {
      toast.error('Registration Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openGoogleMaps = () => {
    if (!selectedCamp) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedCamp.lat},${selectedCamp.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-danger">Step {step} of 6</span>
              <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>
                {step === 1 && 'Personal Details'}
                {step === 2 && 'Blood Group Selection'}
                {step === 3 && 'Eligibility Screening'}
                {step === 4 && 'Schedule Appointment'}
                {step === 5 && 'Review & Confirm'}
                {step === 6 && 'Registration Complete'}
              </span>
            </div>
            <h2 className="modal-title" style={{ marginTop: 4 }}>
              {step === 6 ? 'Registration Confirmed!' : 'Register for Blood Donation'}
            </h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ height: 4, background: 'var(--gray-100)', width: '100%', position: 'relative' }}>
          <div
            style={{
              height: '100%',
              background: 'var(--red-500)',
              width: `${(step / 6) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--red-50)', padding: '12px 16px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <User size={20} color="var(--red-500)" />
                <span style={{ fontSize: 13, color: 'var(--red-600)', fontWeight: 600 }}>
                  Enter accurate donor details matching your government-issued photo ID.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name <span style={{ color: 'var(--red-500)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kirtika Khowal"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number (WhatsApp updates) <span style={{ color: 'var(--red-500)' }}>*</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age (Years) <span style={{ color: 'var(--red-500)' }}>*</span></label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    className="form-input"
                    placeholder="24"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`btn btn-sm ${gender === g ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Blood Group */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                Select your verified blood group. If you are unsure, choose your best estimate—the medical team will perform an instant spot check.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {BLOOD_GROUPS.map(bg => {
                  const isSelected = bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      style={{
                        padding: '16px 8px',
                        borderRadius: 14,
                        border: isSelected ? '2px solid var(--red-500)' : '1.5px solid var(--border)',
                        background: isSelected ? 'var(--red-50)' : 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Droplets size={24} color={isSelected ? 'var(--red-500)' : 'var(--gray-400)'} />
                      <span style={{ fontSize: 18, fontWeight: 800, color: isSelected ? 'var(--red-600)' : 'var(--gray-800)' }}>
                        {bg}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCamp && (
                <div style={{ marginTop: 10, padding: 14, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 4 }}>
                    Camp Urgency Status:
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {selectedCamp.bloodGroupsNeeded.includes(bloodGroup) || selectedCamp.bloodGroupsNeeded.includes('All Groups')
                      ? `🟢 Great! Your blood group (${bloodGroup}) is specifically requested at ${selectedCamp.name}.`
                      : `🔵 All blood groups are welcomed to donate at ${selectedCamp.name}.`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Basic Eligibility Questions */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Mandatory Medical Disclaimer Banner */}
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: 12, display: 'flex', gap: 10 }}>
                <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>Important Medical Disclaimer</div>
                  <div style={{ fontSize: 12, color: '#B45309', marginTop: 2, lineHeight: 1.5 }}>
                    Final eligibility will be confirmed by qualified medical staff at the donation center via physical vitals (BP, Pulse, Hemoglobin).
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                {[
                  { key: 'weightOk', label: 'My weight is at least 45 kg (99 lbs)' },
                  { key: 'healthyToday', label: 'I feel completely healthy and symptom-free today' },
                  { key: 'gapOk', label: 'At least 90 days have passed since my last whole blood donation' },
                  { key: 'noSurgeryTattoo', label: 'No major surgery, dental extraction, or new tattoo in the last 6 months' },
                ].map(q => (
                  <label
                    key={q.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: eligibility[q.key] ? 'var(--gray-50)' : 'white',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={eligibility[q.key]}
                      onChange={e => setEligibility({ ...eligibility, [q.key]: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: 'var(--red-500)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{q.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Preferred Date & Time Slot */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Camp / Location</label>
                <select
                  className="form-input"
                  value={selectedCamp?.id || ''}
                  onChange={e => {
                    const c = availableCamps.find(x => x.id === e.target.value);
                    setSelectedCamp(c);
                    if (c) setPreferredDate(c.date);
                  }}
                >
                  {availableCamps.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.city} ({c.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select 1-Hour Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TIME_SLOTS.map(slot => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'center' }}
                      >
                        <Clock size={13} /> {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Confirm */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--gray-50)', padding: 18, borderRadius: 14, border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
                  Booking Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--gray-500)' }}>Donor Name:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{fullName} ({gender}, Age {age})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--gray-500)' }}>Blood Group:</span>
                    <span style={{ fontWeight: 800, color: 'var(--red-600)' }}>{bloodGroup}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--gray-500)' }}>Camp:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)', textAlign: 'right', maxWidth: 280 }}>
                      {selectedCamp?.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--gray-500)' }}>Date & Slot:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{preferredDate} ({timeSlot})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--gray-500)' }}>Organizer NGO:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{selectedCamp?.ngoName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-500)' }}>Reward Points:</span>
                    <span style={{ fontWeight: 800, color: 'var(--success)' }}>+100 Points on Confirmation</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-500)' }}>
                <ShieldCheck size={16} color="var(--success)" />
                <span>Your contact details are encrypted and shared only with the organizing NGO medical team.</span>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation & Ticket Receipt */}
          {step === 6 && createdReg && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'center', alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--success-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)',
              }}>
                <CheckCircle size={36} strokeWidth={2.5} />
              </div>

              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>
                  You are All Set to Save Lives!
                </h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                  Registration Reference: <strong style={{ color: 'var(--red-600)', letterSpacing: '0.05em' }}>{createdReg.id}</strong>
                </p>
              </div>

              {/* Digital Pass Card */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: 'white',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--red-300)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Blood Donation Appointment Pass
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{createdReg.campName}</div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--red-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>
                    {createdReg.bloodGroup}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#94A3B8' }}>Date</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{createdReg.date}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94A3B8' }}>Time Slot</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{createdReg.timeSlot}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ color: '#94A3B8' }}>Location</div>
                    <div style={{ fontWeight: 600, marginTop: 2, lineHeight: 1.4 }}>{createdReg.location}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={openGoogleMaps}
                  style={{ flex: 1, gap: 6 }}
                >
                  <Navigation size={15} /> Get Directions
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                  style={{ flex: 1 }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        {step < 6 && (
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(step - 1)}
                disabled={submitting}
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
            )}

            {step < 5 ? (
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                disabled={submitting}
                style={{ minWidth: 160 }}
              >
                {submitting ? 'Confirming...' : 'Confirm Registration'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
