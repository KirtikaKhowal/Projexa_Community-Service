import { useState, useEffect, useRef } from 'react';
import { Home, LayoutDashboard } from 'lucide-react';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import MobileScreens from './components/MobileScreens';
import DonorDashboard from './pages/DonorDashboard';
import CampaignDashboard from './pages/CampaignDashboard';
import NearbyBloodCamps from './pages/NearbyBloodCamps';
import HomeCollection from './pages/HomeCollection';
import FinancialContribution from './pages/FinancialContribution';
import RewardsPage from './pages/RewardsPage';
import NotificationsPage from './pages/NotificationsPage';
import DonationSuccess from './pages/DonationSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import RegistrationsPage from './pages/RegistrationsPage';
import BloodNeedsPage from './pages/BloodNeedsPage';
import CertificatesPage from './pages/CertificatesPage';
import NgoDashboard from './pages/NgoDashboard';
import { dataService } from './services/dataService';

/* ── Public page IDs accessible without authentication ── */
const PUBLIC_PAGES = new Set([
  'landing', 'home', 'login', 'signup', 'auth',
]);

/* ── Admin page IDs ── */
const ADMIN_PAGES = new Set([
  'admin-dashboard', 'users', 'ngos', 'ngo-verification',
  'home-requests', 'contributions', 'reports',
]);

/* ── Page transition wrapper ── */
function PageTransition({ pageKey, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.remove('page-enter');
      void ref.current.offsetWidth; // reflow
      ref.current.classList.add('page-enter');
    }
  }, [pageKey]);
  return (
    <div ref={ref} className="page-enter" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}

/* ── Sidebar layout helper ── */
function SidebarLayout({ activePage, setActivePage, variant = 'donor', children }) {
  return (
    <div className="layout-sidebar">
      <Sidebar activePage={activePage} setActivePage={setActivePage} variant={variant} />
      <main className="page-main">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ── Generic "coming soon" page ── */
function ComingSoonPage({ label, setActivePage }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--red-50)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <LayoutDashboard size={32} color="var(--red-500)" strokeWidth={1.5} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
        {label}
      </h2>
      <p style={{ color: 'var(--gray-500)', fontSize: 15, maxWidth: 380, lineHeight: 1.7, marginBottom: 24 }}>
        This section is under active development and will be available soon.
      </p>
      <button className="btn btn-primary" onClick={() => setActivePage('donor-dashboard')}>
        <Home size={15} /> Back to Dashboard
      </button>
    </div>
  );
}

/* ── Page labels for sidebar pages ── */
const PAGE_LABELS = {
  donors:             'Donors',
  donations:          'Donations',
  'blood-collection': 'Blood Collection',
  settings:           'Settings',
  reports:            'Reports',
};

/* ── Root App ── */
export default function App() {
  const [isAuth, setIsAuth] = useState(() => dataService.isAuthenticated());
  const [activePage, setActivePage] = useState(() => {
    return dataService.isAuthenticated() ? 'donor-dashboard' : 'login';
  });

  useEffect(() => {
    const syncAuth = () => {
      const auth = dataService.isAuthenticated();
      setIsAuth(auth);
      if (!auth && !PUBLIC_PAGES.has(activePage)) {
        setActivePage('login');
      }
    };
    const unsub = dataService.subscribe(syncAuth);
    return () => unsub();
  }, [activePage]);

  const handleLoginSuccess = (role) => {
    setIsAuth(true);
    if (role === 'admin') setActivePage('admin-dashboard');
    else if (role === 'ngo') setActivePage('ngo-dashboard');
    else setActivePage('donor-dashboard');
  };

  const renderContent = () => {
    /* Auth (Login & Sign Up) */
    if (activePage === 'login' || activePage === 'signup' || activePage === 'auth') {
      return (
        <AuthPage
          initialMode={activePage === 'signup' ? 'signup' : 'login'}
          setActivePage={setActivePage}
          onSuccess={handleLoginSuccess}
        />
      );
    }

    /* Landing (Public Info) */
    if (activePage === 'landing' || activePage === 'home') {
      return (
        <>
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          <LandingPage setActivePage={setActivePage} />
          <MobileScreens setActivePage={setActivePage} />
        </>
      );
    }

    /* ── AUTH GUARD: Enforce Login for all Protected Routes ── */
    if (!isAuth && !PUBLIC_PAGES.has(activePage)) {
      return (
        <AuthPage
          initialMode="login"
          setActivePage={setActivePage}
          redirectMessage="Authentication required. Please log in or create an account to access this portal."
          onSuccess={handleLoginSuccess}
        />
      );
    }

    /* Donor Dashboard */
    if (activePage === 'donor-dashboard') {
      return <DonorDashboard activePage={activePage} setActivePage={setActivePage} />;
    }

    /* NGO Operations Dashboard */
    if (activePage === 'ngo-dashboard') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage} variant="ngo">
          <NgoDashboard setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Admin Dashboard */
    if (activePage === 'admin-dashboard' || ADMIN_PAGES.has(activePage)) {
      return <AdminDashboard activePage={activePage} setActivePage={setActivePage} />;
    }

    /* Nearby Blood Camps */
    if (activePage === 'nearby') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <NearbyBloodCamps />
        </SidebarLayout>
      );
    }

    /* Campaigns Discovery */
    if (activePage === 'campaigns' || activePage === 'analytics') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <CampaignDashboard activePage={activePage} setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Registrations */
    if (activePage === 'registrations') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <RegistrationsPage setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Urgent Blood Needs */
    if (activePage === 'blood-needs') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <BloodNeedsPage setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Home Collection */
    if (activePage === 'home-collection') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <HomeCollection onSuccess={() => setActivePage('home-collection')} />
        </SidebarLayout>
      );
    }

    /* Support NGOs / Contribute */
    if (activePage === 'contribute') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <FinancialContribution onSuccess={() => {}} />
        </SidebarLayout>
      );
    }

    /* Certificates */
    if (activePage === 'certificates') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <CertificatesPage setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Rewards */
    if (activePage === 'rewards') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <RewardsPage />
        </SidebarLayout>
      );
    }

    /* Notifications */
    if (activePage === 'notifications') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <NotificationsPage setActivePage={setActivePage} />
        </SidebarLayout>
      );
    }

    /* Donation Success */
    if (activePage === 'success') {
      return (
        <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
          <DonationSuccess
            onViewDonations={() => setActivePage('registrations')}
            onShare={() => {}}
          />
        </SidebarLayout>
      );
    }

    /* Generic sidebar page */
    return (
      <SidebarLayout activePage={activePage} setActivePage={setActivePage}>
        <ComingSoonPage
          label={PAGE_LABELS[activePage] || activePage}
          setActivePage={setActivePage}
        />
      </SidebarLayout>
    );
  };

  return (
    <ToastProvider>
      <div style={{ fontFamily: 'var(--font)' }}>
        <PageTransition pageKey={activePage}>
          {renderContent()}
        </PageTransition>
      </div>
    </ToastProvider>
  );
}
