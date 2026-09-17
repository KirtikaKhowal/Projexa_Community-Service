import { useState } from 'react';
import {
  Droplets, Heart, Users, Mail, Lock, Eye, EyeOff, User,
  Phone, LogIn, UserPlus, Check, ArrowRight, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';

import { dataService } from '../services/dataService';

export default function AuthPage({ initialMode = 'login', setActivePage, onSuccess, redirectMessage }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('donor'); // 'donor' | 'ngo' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('kirtika.khowal@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      toast.warning('Required Fields', 'Please enter your email/mobile and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const session = dataService.login({
        email: loginIdentifier,
        role: selectedRole,
        name: selectedRole === 'admin' ? 'Super Admin' : selectedRole === 'ngo' ? 'Red Cross Official' : 'Kirtika Khowal',
      });

      toast.success(
        selectedRole === 'admin' ? 'Admin Authenticated' : selectedRole === 'ngo' ? 'NGO Portal Access Granted' : 'Welcome back, Hero!',
        'Successfully logged into BloodConnect.'
      );

      if (onSuccess) {
        onSuccess(selectedRole);
      } else if (setActivePage) {
        if (selectedRole === 'admin') setActivePage('admin-dashboard');
        else if (selectedRole === 'ngo') setActivePage('ngo-dashboard');
        else setActivePage('donor-dashboard');
      }
    }, 600);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !phone || !signupPassword) {
      toast.warning('Missing Fields', 'Please complete all required fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      toast.error('Password Mismatch', 'Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      toast.warning('Terms & Conditions', 'Please accept the Terms & Conditions to proceed.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const session = dataService.login({
        email: signupEmail,
        role: selectedRole,
        name: fullName,
      });

      toast.success('Welcome to BloodConnect!', 'Your account has been created. Redirecting to dashboard...');

      if (onSuccess) {
        onSuccess(selectedRole);
      } else if (setActivePage) {
        if (selectedRole === 'admin') setActivePage('admin-dashboard');
        else if (selectedRole === 'ngo') setActivePage('ngo-dashboard');
        else setActivePage('donor-dashboard');
      }
    }, 700);
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dataService.login({
        email: `${provider.toLowerCase()}user@bloodconnect.org`,
        role: selectedRole,
        name: 'Kirtika Khowal',
      });
      toast.success(`${provider} Connected`, `Signed in with ${provider} successfully.`);
      if (onSuccess) {
        onSuccess(selectedRole);
      } else if (setActivePage) {
        if (selectedRole === 'admin') setActivePage('admin-dashboard');
        else if (selectedRole === 'ngo') setActivePage('ngo-dashboard');
        else setActivePage('donor-dashboard');
      }
    }, 500);
  };

  const handleForgotPassword = () => {
    toast.info('Password Reset', 'A password reset link has been sent to your registered contact.');
  };

  return (
    <div className="auth-page-root">
      {/* Background ambient shapes */}
      <div className="auth-bg-blob auth-bg-blob-1" />
      <div className="auth-bg-blob auth-bg-blob-2" />

      {/* Decorative Bottom Wave Ribbon */}
      <svg className="auth-bottom-wave" viewBox="0 0 1440 240" fill="none" preserveAspectRatio="none">
        <path
          d="M-50 160 C 250 80, 480 220, 800 130 C 1100 50, 1300 180, 1500 110"
          stroke="#F87171"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          opacity="0.45"
        />
        <path
          d="M-80 180 C 220 100, 520 230, 840 140 C 1150 60, 1350 200, 1520 130"
          stroke="#DC2626"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* ── Top Header Navigation ── */}
      <header className="auth-header">
        <div className="auth-header-container">
          {/* Logo */}
          <button
            onClick={() => setActivePage && setActivePage('landing')}
            className="auth-logo-btn"
            aria-label="Go to BloodConnect Home"
          >
            <div className="auth-logo-icon">
              <Droplets size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1 }}>
              <div className="auth-logo-title">BloodConnect</div>
              <div className="auth-logo-sub">Every Drop Counts</div>
            </div>
          </button>

          {/* Top Switcher */}
          <div className="auth-top-action">
            <span className="auth-top-action-text">
              {isLogin ? 'New here?' : 'Already have an account?'}
            </span>
            <button
              onClick={() => setMode(isLogin ? 'signup' : 'login')}
              className="auth-top-btn"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Split Layout ── */}
      <main className="auth-main-container">
        {/* Left Column: Brand & Hero Story */}
        <section className="auth-hero-col">
          {/* Tagline Pill */}
          <div className="auth-badge">
            <Sparkles size={14} color="#DC2626" />
            <span>Every Drop Counts ✨</span>
          </div>

          {/* Hero Heading */}
          <h1 className="auth-hero-title">
            {isLogin ? (
              <>
                Welcome Back<br />
                <span className="auth-hero-highlight">
                  Heroes
                  <svg className="auth-squiggle" viewBox="0 0 170 14" fill="none">
                    <path
                      d="M2 9 C 35 3, 75 14, 115 5 C 138 0, 155 10, 168 7"
                      stroke="#DC2626"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>
                Join the<br />
                <span className="auth-hero-highlight">
                  Movement
                  <svg className="auth-squiggle" viewBox="0 0 210 14" fill="none">
                    <path
                      d="M2 9 C 45 3, 95 14, 145 5 C 172 0, 195 10, 208 7"
                      stroke="#DC2626"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="auth-hero-desc">
            {isLogin
              ? 'Your generosity saves lives. Log in to continue making a difference.'
              : 'Be a donor. Be a hero. Together we can save lives.'}
          </p>

          {/* Benefit Cards */}
          <div className="auth-features-list">
            {isLogin ? (
              <>
                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Droplets size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Find Blood Drives</h3>
                    <p className="auth-feature-desc">Be a part of life saving events</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Users size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Connect with Donors</h3>
                    <p className="auth-feature-desc">Build a stronger community</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Heart size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Save Lives</h3>
                    <p className="auth-feature-desc">One donation can save up to 3 lives</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Droplets size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Donate Blood</h3>
                    <p className="auth-feature-desc">Help patients in need</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Users size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Join Community</h3>
                    <p className="auth-feature-desc">Meet like-minded people</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon-wrap">
                    <Heart size={20} color="#DC2626" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="auth-feature-title">Make an Impact</h3>
                    <p className="auth-feature-desc">Your small step saves lives</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Artistic Footer with 3D Drop */}
          <div className="auth-art-container">
            <div className="auth-script-note">
              Real People. Real Impact. ♡
            </div>

            {/* 3D Blood Drop Visual */}
            <div className="auth-drop-wrapper">
              <svg width="150" height="175" viewBox="0 0 200 240" fill="none" className="auth-drop-svg">
                <defs>
                  {/* Outer 3D radial gradient */}
                  <radialGradient id="drop3d" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="35%" stopColor="#E11D48" />
                    <stop offset="70%" stopColor="#BE123C" />
                    <stop offset="100%" stopColor="#881337" />
                  </radialGradient>
                  {/* Subtle inner highlight */}
                  <linearGradient id="dropHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                  </linearGradient>
                  {/* Glow filter */}
                  <filter id="dropGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#DC2626" floodOpacity="0.38" />
                  </filter>
                </defs>

                {/* Main Droplet Shape */}
                <path
                  d="M100 18 C100 18 35 100 35 156 C35 196 64 226 100 226 C136 226 165 196 165 156 C165 100 100 18 100 18 Z"
                  fill="url(#drop3d)"
                  filter="url(#dropGlow)"
                />
                {/* Surface gloss shine */}
                <ellipse cx="78" cy="115" rx="14" ry="24" transform="rotate(-28 78 115)" fill="url(#dropHighlight)" />

                {/* Pure White Heart in center */}
                <g transform="translate(68, 126) scale(0.68)">
                  <path
                    d="M47.6 17.8C43.5 13.7 36.9 13.7 32.8 17.8L32 18.6L31.2 17.8C27.1 13.7 20.5 13.7 16.4 17.8C12.3 21.9 12.3 28.5 16.4 32.6L32 48.2L47.6 32.6C51.7 28.5 51.7 21.9 47.6 17.8Z"
                    fill="#FFFFFF"
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}
                  />
                </g>
              </svg>

              {/* Floating Hearts */}
              <div className="auth-floating-heart auth-fh-1">♥</div>
              <div className="auth-floating-heart auth-fh-2">♥</div>
              <div className="auth-floating-heart auth-fh-3">♥</div>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Auth Card */}
        <section className="auth-card-col">
          <div className="auth-card">
            {/* Card Header */}
            <div className="auth-card-header">
              <h2 className="auth-card-title">
                {isLogin ? (
                  <>
                    Login to <span style={{ color: 'var(--red-600, #DC2626)' }}>BloodConnect</span>
                  </>
                ) : (
                  <>
                    Create Your <span style={{ color: 'var(--red-600, #DC2626)' }}>Account</span>
                  </>
                )}
              </h2>
              <p className="auth-card-subtitle">
                {isLogin
                  ? 'Welcome back! Please login to your account.'
                  : 'Join BloodConnect and be a part of something bigger.'}
              </p>
            </div>

            {/* Redirect Notice if user attempted to enter inside without login */}
            {redirectMessage && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 12.5,
                color: 'var(--red-600)',
                fontWeight: 600,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertCircle size={16} />
                <span>{redirectMessage}</span>
              </div>
            )}

            {/* Portal Role Switcher Tabs */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Select Portal Access Role:
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
                background: 'var(--gray-100)', padding: 3, borderRadius: 10,
              }}>
                {[
                  { id: 'donor', label: '🩸 Donor' },
                  { id: 'ngo', label: '🏥 NGO Partner' },
                  { id: 'admin', label: '🛡️ Admin' },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.id);
                      if (r.id === 'admin') setLoginIdentifier('admin@bloodconnect.org');
                      else if (r.id === 'ngo') setLoginIdentifier('delhi@indianredcross.org');
                      else setLoginIdentifier('kirtika.khowal@example.com');
                    }}
                    style={{
                      padding: '7px 0',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      background: selectedRole === r.id ? 'white' : 'transparent',
                      color: selectedRole === r.id ? 'var(--red-600)' : 'var(--gray-600)',
                      boxShadow: selectedRole === r.id ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                {/* Email or Mobile Number */}
                <div className="auth-input-group">
                  <label className="auth-label">Email or Mobile Number <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Mail className="auth-input-icon" size={18} />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter your email or mobile number"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-input-group">
                  <label className="auth-label">Password <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input auth-input-with-toggle"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="auth-options-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="auth-forgot-btn"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-primary-btn"
                >
                  <LogIn size={18} />
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="auth-form">
                {/* Full Name */}
                <div className="auth-input-group">
                  <label className="auth-label">Full Name <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <User className="auth-input-icon" size={18} />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="auth-input-group">
                  <label className="auth-label">Email Address <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Mail className="auth-input-icon" size={18} />
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="Enter your email address"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="auth-input-group">
                  <label className="auth-label">Phone Number <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Phone className="auth-input-icon" size={18} />
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="Enter your mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-input-group">
                  <label className="auth-label">Password <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input auth-input-with-toggle"
                      placeholder="Create a strong password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-input-group">
                  <label className="auth-label">Confirm Password <span className="auth-req">*</span></label>
                  <div className="auth-input-wrapper">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="auth-input auth-input-with-toggle"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="auth-terms-group">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <span className="auth-terms-text">
                      I agree to the <span className="auth-link-highlight">Terms & Conditions</span> and{' '}
                      <span className="auth-link-highlight">Privacy Policy</span>
                    </span>
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-primary-btn"
                >
                  <UserPlus size={18} />
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="auth-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <span className="auth-divider-line" />
            </div>

            {/* Social Logins */}
            <div className="auth-social-stack">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="auth-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialAuth('Apple')}
                className="auth-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.83-.98 2.94 1.08.08 2.15-.55 2.79-1.28z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Bottom Mode Switch Link */}
            <div className="auth-card-footer">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="auth-footer-link"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="auth-footer-link"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
