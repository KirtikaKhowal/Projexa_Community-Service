import { useState, useEffect } from 'react';
import {
  Heart, Shield, CheckCircle2, Award, Printer, Download,
  CreditCard, Smartphone, Building, ArrowRight, ShieldCheck
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../components/ui/Toast';

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

export default function FinancialContribution({ onSuccess }) {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [donorName, setDonorName] = useState('Kirtika Khowal');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'history'

  const toast = useToast();

  useEffect(() => {
    const sync = () => {
      const ngoList = dataService.getNgos();
      setNgos(ngoList);
      if (!selectedNgo && ngoList.length > 0) {
        setSelectedNgo(ngoList[0]);
      }
      setHistory(dataService.getContributions());
    };
    sync();
    return dataService.subscribe(sync);
  }, []);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handlePay = (e) => {
    e.preventDefault();
    if (!selectedNgo) {
      toast.warning('Select NGO', 'Please choose an accredited NGO to support.');
      return;
    }
    if (finalAmount < 50) {
      toast.warning('Minimum Amount', 'Minimum contribution amount is ₹50.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const record = dataService.createContribution({
        ngoId: selectedNgo.id,
        amount: finalAmount,
        paymentMethod,
      });

      setIsProcessing(false);
      setCompletedTxn(record);
      toast.success('Donation Received! ❤️', `Thank you for contributing ₹${finalAmount} to ${selectedNgo.name}.`);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Heart size={26} color="var(--red-500)" />
            Support Verified NGOs Financially
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
            Empower mobile donation vans, blood testing reagents, and emergency supplies. 100% tax-exempt under Section 80G.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--gray-100)', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'donate' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setActiveTab('donate'); setCompletedTxn(null); }}
          >
            Contribute Now
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('history')}
          >
            Receipts & History ({history.length})
          </button>
        </div>
      </div>

      {/* COMPLETED SUCCESS RECEIPT */}
      {completedTxn ? (
        <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--success-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success)'
          }}>
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>
            Contribution Acknowledged!
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4, marginBottom: 20 }}>
            Transaction Reference: <strong style={{ color: 'var(--gray-800)' }}>{completedTxn.id}</strong>
          </p>

          {/* 80G Tax Receipt Frame */}
          <div style={{
            background: '#FFFDF9', border: '2px dashed #CBD5E1', borderRadius: 14,
            padding: 20, textAlign: 'left', fontSize: 13, color: 'var(--gray-700)', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
              <span style={{ color: 'var(--gray-500)' }}>Recipient Organization:</span>
              <strong style={{ color: 'var(--gray-900)' }}>{completedTxn.ngoName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
              <span style={{ color: 'var(--gray-500)' }}>Amount Contributed:</span>
              <strong style={{ fontSize: 16, color: 'var(--red-600)' }}>₹{completedTxn.amount.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
              <span style={{ color: 'var(--gray-500)' }}>Section 80G Approval:</span>
              <strong style={{ color: '#16A34A' }}>{completedTxn.taxExempt80G}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Reward Points Credited:</span>
              <strong style={{ color: 'var(--success)' }}>+{completedTxn.pointsEarned} Points</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handlePrintReceipt}
              style={{ flex: 1, gap: 6 }}
            >
              <Printer size={15} /> Print Official 80G Receipt
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setCompletedTxn(null); setActiveTab('history'); }}
              style={{ flex: 1 }}
            >
              View Contribution History
            </button>
          </div>
        </div>
      ) : activeTab === 'donate' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
          {/* Left Column: NGO Selection & Mission */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>
              1. Select a Verified Partner NGO
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ngos.map(ngo => {
                const isSelected = selectedNgo?.id === ngo.id;

                return (
                  <div
                    key={ngo.id}
                    onClick={() => setSelectedNgo(ngo)}
                    className="card"
                    style={{
                      padding: 18,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--red-500)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--red-50)' : 'white',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{ngo.name}</h4>
                        <span className="badge badge-success" style={{ fontSize: 11 }}>
                          <ShieldCheck size={11} /> Verified
                        </span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)' }}>{ngo.city}</span>
                    </div>

                    <p style={{ fontSize: 12.5, color: 'var(--gray-600)', lineHeight: 1.5, marginTop: 4, marginBottom: 8 }}>
                      {ngo.description}
                    </p>

                    <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--gray-500)' }}>
                      <span>License: <strong>{ngo.licenseNo}</strong></span>
                      <span>•</span>
                      <span>Supported Camps: <strong>{ngo.supportedCampaigns}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Amount & Payment Card */}
          <form onSubmit={handlePay} className="card" style={{ padding: 24, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
              2. Enter Contribution Amount
            </h3>

            {/* Preset buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PRESET_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`btn btn-sm ${(!customAmount && selectedAmount === amt) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ justifyContent: 'center', fontWeight: 800 }}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="form-group">
              <label className="form-label">Or Custom Amount (₹)</label>
              <input
                type="number"
                min="50"
                className="form-input"
                placeholder="e.g. 1500"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
              />
            </div>

            {/* Donor Name & PAN for 80G */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">PAN (For 80G)</label>
                <input
                  type="text"
                  className="form-input"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['UPI / QR', 'Card', 'Net Banking'].map(pm => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`btn btn-sm ${paymentMethod === pm ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, fontSize: 12 }}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Points preview note */}
            <div style={{ background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 10, fontSize: 12, color: 'var(--gray-600)' }}>
              🎁 You will earn <strong style={{ color: 'var(--red-600)' }}>+{Math.floor(finalAmount * 0.5)} LifeSaver Points</strong> with this donation!
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
              style={{ width: '100%', height: 44, justifyContent: 'center' }}
            >
              {isProcessing ? 'Processing Payment...' : `Contribute ₹${finalAmount.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>
      ) : (
        /* TAB 2: History & Receipts */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {history.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Heart size={40} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Contributions Yet</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
                When you make a financial contribution, your tax receipts and transaction records will appear here.
              </p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--red-600)' }}>{item.id}</span>
                    <span className="badge badge-success">80G Tax Exempt</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginTop: 2 }}>
                    {item.ngoName}
                  </h4>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                    Date: {item.date} • Mode: {item.paymentMethod} • 80G Ref: {item.taxExempt80G}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--gray-900)' }}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700 }}>
                      +{item.pointsEarned} Points
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setCompletedTxn(item);
                    }}
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
