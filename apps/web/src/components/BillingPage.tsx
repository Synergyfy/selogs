import React, { useState } from 'react';
import { 
  CreditCard, 
  History, 
  Download, 
  ExternalLink,
  Plus,
  ShieldCheck,
  Calendar,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useInvoicesList, usePaymentMethods, useSetDefaultPaymentMethod } from '../hooks/dashboard/useBilling';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const BillingPage: React.FC = () => {
  const [page] = useState(1);
  const navigate = useNavigate();
  const { data: invoicesData, isLoading: isLoadingInvoices } = useInvoicesList(page, 20);
  const { data: paymentMethods = [], isLoading: isLoadingMethods } = usePaymentMethods();
  const setDefaultMethod = useSetDefaultPaymentMethod();

  const invoices = invoicesData?.items || [];

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: '2-digit' });

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMethod.mutateAsync(id);
    } catch (err) {
      console.error('Failed to set default method', err);
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Billing &amp; Invoices</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Manage your payment methods and view your transaction history.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Payment Methods */}
        <div className="content-card">
          <div className="card-header">
            <h3>Payment Methods</h3>
            <button className="btn-text" onClick={() => navigate('/dashboard/subscription')}>
              <Plus size={16} /> Add New
            </button>
          </div>

          {isLoadingMethods ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <Loader2 size={24} className="spin" />
            </div>
          ) : paymentMethods.length > 0 ? (
            paymentMethods.map((method, i) => (
              <div key={i} className="v-stat" style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="stat-icon-wrapper blue" style={{ width: '40px', height: '40px' }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px' }}>{method.brand} ending in {method.last4}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Expires {method.expMonth}/{method.expYear}
                      {method.isDefault && <span style={{ color: 'var(--accent)', marginLeft: '8px', fontWeight: 700 }}>• Default</span>}
                    </span>
                  </div>
                </div>
                {!method.isDefault ? (
                  <button 
                    className="btn-glass-sm" 
                    style={{ fontSize: '11px' }}
                    onClick={() => handleSetDefault(method.id)}
                    disabled={setDefaultMethod.isPending}
                  >
                    {setDefaultMethod.isPending ? <Loader2 size={12} className="spin" /> : 'Set Default'}
                  </button>
                ) : (
                  <CheckCircle2 size={18} className="text-emerald" />
                )}
              </div>
            ))
          ) : (
            <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="stat-icon-wrapper blue" style={{ width: '48px', height: '48px' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '16px' }}>No payment methods found</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Subscribe to a plan to save a card.</span>
                </div>
              </div>
            </div>
          )}

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
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Total Invoices</span>
              <strong style={{ fontSize: '18px' }}>{invoicesData?.total ?? '—'}</strong>
            </div>
            <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Active Cards</span>
              <strong style={{ fontSize: '18px', color: 'var(--accent)' }}>{paymentMethods.length}</strong>
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
                  <th>Invoice #</th>
                  <th>Billing Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingInvoices ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                      <Loader2 size={24} className="spin" style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-mono" style={{ fontSize: '13px' }}>{inv.invoiceNumber}</td>
                      <td className="text-muted">{formatDate(inv.createdAt)}</td>
                      <td className="font-bold">{formatAmount(inv.amount)}</td>
                      <td>
                        <span className={`status-badge ${inv.status === 'paid' ? 'synced' : inv.status === 'failed' ? 'danger' : 'pending'}`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="copy-code-btn" title="Download PDF"><Download size={14} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="no-data">No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
