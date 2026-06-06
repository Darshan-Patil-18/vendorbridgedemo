import { useState } from 'react';
import Layout from '../components/Layout';
import { TrendingDown, Star, Clock, CheckCircle, Award } from 'lucide-react';
import './SharedPages.css';

function QuotationComparison({ user, onLogout }) {
  const [selectedRFQ, setSelectedRFQ] = useState('RFQ-001');

  const rfqs = [
    { id: 'RFQ-001', title: 'Office Supplies Q1 2026' },
    { id: 'RFQ-002', title: 'IT Hardware Procurement' },
    { id: 'RFQ-003', title: 'Marketing Services' }
  ];

  const quotations = {
    'RFQ-001': [
      {
        vendor: 'Office Mart',
        totalAmount: 12500,
        delivery: '5-7 days',
        rating: 4.2,
        items: [
          { product: 'Printer Paper A4', unitPrice: 45, quantity: 100, total: 4500 },
          { product: 'Gel Pens', unitPrice: 16, quantity: 500, total: 8000 }
        ]
      },
      {
        vendor: 'Global Suppliers',
        totalAmount: 11800,
        delivery: '7-10 days',
        rating: 4.8,
        items: [
          { product: 'Printer Paper A4', unitPrice: 42, quantity: 100, total: 4200 },
          { product: 'Gel Pens', unitPrice: 15.2, quantity: 500, total: 7600 }
        ]
      },
      {
        vendor: 'Quick Office Solutions',
        totalAmount: 13200,
        delivery: '3-5 days',
        rating: 4.0,
        items: [
          { product: 'Printer Paper A4', unitPrice: 48, quantity: 100, total: 4800 },
          { product: 'Gel Pens', unitPrice: 16.8, quantity: 500, total: 8400 }
        ]
      }
    ]
  };

  const currentQuotations = quotations[selectedRFQ] || [];
  const lowestPrice = currentQuotations.length > 0 ? Math.min(...currentQuotations.map(q => q.totalAmount)) : 0;
  const fastestDelivery = currentQuotations.length > 0 ? currentQuotations.reduce((prev, curr) => {
    const prevDays = parseInt(prev.delivery);
    const currDays = parseInt(curr.delivery);
    return currDays < prevDays ? curr : prev;
  }) : null;

  const handleSelectWinner = (vendor) => {
    if (confirm(`Select ${vendor} as the winning vendor?`)) {
      alert(`${vendor} has been selected! Proceeding to approval workflow.`);
    }
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="quotation-comparison">
        <div className="page-header">
          <div>
            <h1>Compare Quotations</h1>
            <p>Analyze and select the best vendor quote</p>
          </div>
        </div>

        <div className="rfq-selector">
          <label>Select RFQ:</label>
          <select
            className="form-control"
            value={selectedRFQ}
            onChange={(e) => setSelectedRFQ(e.target.value)}
          >
            {rfqs.map(rfq => (
              <option key={rfq.id} value={rfq.id}>{rfq.id} - {rfq.title}</option>
            ))}
          </select>
        </div>

        {currentQuotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No quotations received</h3>
            <p>Vendors haven't submitted quotations yet</p>
          </div>
        ) : (
          <>
            <div className="comparison-stats">
              <div className="stat-card">
                <TrendingDown size={24} />
                <div>
                  <p>Lowest Price</p>
                  <h3>${lowestPrice.toLocaleString()}</h3>
                </div>
              </div>
              <div className="stat-card">
                <Clock size={24} />
                <div>
                  <p>Fastest Delivery</p>
                  <h3>{fastestDelivery?.delivery}</h3>
                </div>
              </div>
              <div className="stat-card">
                <Star size={24} />
                <div>
                  <p>Quotes Received</p>
                  <h3>{currentQuotations.length}</h3>
                </div>
              </div>
            </div>

            <div className="comparison-grid">
              {currentQuotations.map((quote, idx) => (
                <div key={idx} className={`comparison-card ${quote.totalAmount === lowestPrice ? 'best-price' : ''}`}>
                  {quote.totalAmount === lowestPrice && (
                    <div className="best-badge">
                      <Award size={16} />
                      Best Price
                    </div>
                  )}

                  <div className="vendor-header">
                    <h3>{quote.vendor}</h3>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= quote.rating ? '#f59e0b' : 'none'}
                          stroke={star <= quote.rating ? '#f59e0b' : '#94a3b8'}
                        />
                      ))}
                      <span>{quote.rating}</span>
                    </div>
                  </div>

                  <div className="quote-summary">
                    <div className="summary-item">
                      <span>Total Amount</span>
                      <h2>${quote.totalAmount.toLocaleString()}</h2>
                    </div>
                    <div className="summary-item">
                      <span>Delivery Time</span>
                      <p>{quote.delivery}</p>
                    </div>
                  </div>

                  <div className="items-breakdown">
                    <h4>Item Breakdown</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Unit Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((item, itemIdx) => (
                          <tr key={itemIdx}>
                            <td>{item.product}</td>
                            <td>${item.unitPrice}</td>
                            <td>{item.quantity}</td>
                            <td><strong>${item.total}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleSelectWinner(quote.vendor)}
                  >
                    <CheckCircle size={18} />
                    Select This Quote
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default QuotationComparison;
