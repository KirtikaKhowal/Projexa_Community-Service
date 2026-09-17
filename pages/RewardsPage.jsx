import { useState, useEffect } from 'react';
import {
  Award, Star, Gift, CheckCircle, TrendingUp, Zap, Sparkles,
  Tag, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';

const TIERS = [
  { level: 1, label: 'Starter LifeSaver', minPoints: 0, maxPoints: 300, icon: '🌱' },
  { level: 2, label: 'Community Guardian', minPoints: 300, maxPoints: 700, icon: '🛡️' },
  { level: 3, label: 'Hero Donor', minPoints: 700, maxPoints: 1200, icon: '⭐' },
  { level: 4, label: 'Life Champion', minPoints: 1200, maxPoints: 2000, icon: '🏆' },
  { level: 5, label: 'Legendary LifeSaver', minPoints: 2000, maxPoints: 5000, icon: '👑' },
];

export default function RewardsPage() {
  const [userProfile, setUserProfile] = useState({});
  const [rewards, setRewards] = useState([]);
  const [redeemed, setRedeemed] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'redeemed'
  const [redeemingId, setRedeemingId] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      setUserProfile(dataService.getUserProfile());
      setRewards(dataService.getRewards());
      setRedeemed(dataService.getRedeemedRewards());
    };
    sync();
    return dataService.subscribe(sync);
  }, []);

  const currentPoints = userProfile.rewardPoints || 0;
  const currentTier = TIERS.find(t => currentPoints >= t.minPoints && currentPoints < t.maxPoints) || TIERS[2];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1] || TIERS[TIERS.length - 1];
  const tierProgress = Math.min(100, Math.round(((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100));

  const handleRedeem = (reward) => {
    if (currentPoints < reward.pointsRequired) {
      toast.warning('Insufficient Points', `You need ${reward.pointsRequired} points. Current balance: ${currentPoints} points.`);
      return;
    }

    setRedeemingId(reward.id);
    setTimeout(() => {
      try {
        const res = dataService.redeemReward(reward.id);
        toast.success('Reward Redeemed! 🎉', `Your unique coupon code is ${res.code}.`);
        setActiveTab('redeemed');
      } catch (err) {
        toast.error('Redemption Failed', err.message);
      } finally {
        setRedeemingId(null);
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: 20,
        padding: '26px 30px',
        color: 'white',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: 6 }}>
            LifeSaver Recognition Engine
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>
            Rewards & Milestone Badges
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 13.5, marginTop: 4, maxWidth: 520 }}>
            Earn points for every blood donation (+250), camp registration (+100), and financial contribution (+50 per ₹100).
          </p>
        </div>

        {/* Live Points Pill */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 16,
          padding: '16px 22px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: '#FDE68A', fontWeight: 700, letterSpacing: '0.04em' }}>
            AVAILABLE BALANCE
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'white', marginTop: 2 }}>
            {currentPoints.toLocaleString()} <span style={{ fontSize: 16, color: 'var(--red-400)' }}>pts</span>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
            {currentTier.icon} {currentTier.label}
          </div>
        </div>
      </div>

      {/* Tier Milestone Progress Bar */}
      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 }}>Current Level:</span>
            <strong style={{ fontSize: 15, color: 'var(--gray-900)', marginLeft: 6 }}>
              {currentTier.icon} {currentTier.label}
            </strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>
            Next Milestone: <strong style={{ color: 'var(--red-600)' }}>{nextTier.label}</strong> ({nextTier.minPoints - currentPoints} pts needed)
          </div>
        </div>

        <div style={{ height: 10, background: 'var(--gray-100)', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 100%)',
              width: `${tierProgress}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Tier Badges Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center', fontSize: 11 }}>
          {TIERS.map((t, idx) => {
            const isReached = currentPoints >= t.minPoints;
            return (
              <div key={t.level} style={{ opacity: isReached ? 1 : 0.45 }}>
                <div style={{ fontSize: 18 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, color: isReached ? 'var(--gray-800)' : 'var(--gray-400)', marginTop: 2 }}>
                  {t.label}
                </div>
                <div style={{ color: 'var(--gray-400)', fontSize: 10 }}>{t.minPoints}+ pts</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'available' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('available')}
        >
          Available Rewards ({rewards.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'redeemed' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('redeemed')}
        >
          Redeemed Coupons ({redeemed.length})
        </button>
      </div>

      {/* TAB 1: Available Rewards */}
      {activeTab === 'available' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {rewards.map(reward => {
            const canAfford = currentPoints >= reward.pointsRequired;
            const isBusy = redeemingId === reward.id;

            return (
              <div
                key={reward.id}
                className="card"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: canAfford ? 1 : 0.82,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                      {reward.category}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: canAfford ? 'var(--red-600)' : 'var(--gray-500)' }}>
                      {reward.pointsRequired} pts
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 6 }}>
                    {reward.title}
                  </h3>

                  <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 8 }}>
                    Partner: <strong style={{ color: 'var(--gray-800)' }}>{reward.partner}</strong>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, marginBottom: 16 }}>
                    🎁 {reward.value}
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm ${canAfford ? 'btn-primary' : 'btn-outline'}`}
                  disabled={!canAfford || isBusy}
                  onClick={() => handleRedeem(reward)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isBusy ? 'Redeeming...' : canAfford ? 'Redeem Voucher' : `Need ${reward.pointsRequired - currentPoints} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Redeemed Coupons */}
      {activeTab === 'redeemed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {redeemed.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Tag size={36} color="var(--gray-400)" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>No Redeemed Rewards Yet</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
                Redeem available vouchers using your LifeSaver reward points to view exclusive partner coupons.
              </p>
            </div>
          ) : (
            redeemed.map(item => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                  borderLeft: '4px solid var(--success)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-success">Active Coupon</span>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Redeemed on {item.redeemedAt}</span>
                  </div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>
                    {item.rewardTitle}
                  </h4>
                  <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 2 }}>
                    Deducted: <strong>{item.pointsSpent} Points</strong>
                  </div>
                </div>

                {/* Coupon Code Pill */}
                <div style={{
                  background: 'var(--gray-50)',
                  border: '1.5px dashed var(--red-300)',
                  borderRadius: 12,
                  padding: '10px 18px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>USE COUPON CODE</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--red-600)', letterSpacing: '0.08em', marginTop: 2 }}>
                    {item.code}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
