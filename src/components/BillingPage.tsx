import React from 'react';
import { 
  CreditCard, 
  History, 
  Download, 
  ExternalLink,
  Plus,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import './Dashboard.css';

const BillingPage: React.FC = () => {
  const invoices = [
    { id: 'INV-2026-001', date: 'May 01, 2026', amount: '₦15,000', status: 'Paid', method: '•••• 4242' },
    { id: 'INV-2026-002', date: 'Apr 01, 2026', amount: '₦15,000', status: 'Paid', method: '•••• 4242' },
    { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '₦15,000', status: 'Paid', method: '•••• 4242' },
    { id: 'INV-2025-012', date: 'Feb 01, 2026', amount: '₦15,000', status: 'Paid', method: '•••• 4242' },
  ];

  return (
    <div className="dashboard-overview">
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Billing & Invoices</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Manage your payment methods and view your transaction history.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Payment Methods */}
        <div className="content-card">
          <div className="card-header">
            <h3>Payment Methods</h3>
            <button className="btn-text"><Plus size={16} /> Add New</button>
          </div>
          
          <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon-wrapper blue" style={{ width: '48px', height: '48px' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '16px' }}>Visa Ending in 4242</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Expires 12/28 • Default Method</span>
              </div>
            </div>
            <span className="status-badge synced">ACTIVE</span>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
              Payments are securely processed via <strong>Paystack</strong>. 
              <ExternalLink size={12} style={{ marginLeft: '4px', display: 'inline' }} />
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="content-card">
          <div className="card-header">
            <h3>Billing Summary</h3>
          </div>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Next Bill</span>
                <strong style={{ fontSize: '18px' }}>June 01, 2026</strong>
             </div>
             <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Amount Due</span>
                <strong style={{ fontSize: '18px', color: 'var(--accent)' }}>₦15,000</strong>
             </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', fontSize: '13px' }}>
             <ShieldCheck size={18} className="text-gradient" />
             <span>Your billing information is encrypted and secure.</span>
          </div>
        </div>

        {/* Billing History */}
        <div className="content-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3>Invoice History</h3>
            <div className="flex-center gap-12">
              <button className="btn-glass-sm"><Calendar size={14} /> Filter Date</button>
              <button className="btn-glass-sm"><History size={14} /> Full Export</button>
            </div>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Billing Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono" style={{ fontSize: '13px' }}>{inv.id}</td>
                    <td className="text-muted">{inv.date}</td>
                    <td className="font-bold">{inv.amount}</td>
                    <td className="text-muted">{inv.method}</td>
                    <td>
                      <span className={`status-badge synced`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button className="copy-code-btn" title="Download PDF"><Download size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
