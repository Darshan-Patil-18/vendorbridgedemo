import { useState } from 'react';
import Layout from '../components/Layout';
import { Send, Calendar, DollarSign, FileText, Package } from 'lucide-react';
import './SharedPages.css';

function QuotationSubmission({ user, onLogout }) {
  const [rfqs, setRfqs] = useState([
    {
      id: 'RFQ-001',
      title: 'Office Supplies Q1 2026',
      deadline: '2026-06-15',
      items: [
        { product: 'Printer Paper A4', quantity: 100, unit: 'boxes' },
        { product: 'Gel Pens', quantity: 500, unit: 'pieces' }
      ],
      hasQuoted: false
    },
    {
      id: 'RFQ-002',
      title: 'IT Hardware Procurement',
      deadline: '2026-06-20',
      items: [
        { product: 'Laptop Dell XPS 15', quantity: 20, unit: 'units' },
        { product: 'Wireless Mouse', quantity: 30, unit: 'pieces' }
      ],
      hasQuoted: false
    }
  ]);

  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [quotation, setQuotation] = useState({
    unitPrices: {},
    deliveryTime: '',
    notes: '',
    validityPeriod: '30'
  });

  const handleSelectRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    const initialPrices = {};
    rfq.items.forEach((item, idx) => {
      initialPrices[idx] = '';
    });
    setQuotation({ ...quotation, unitPrices: initialPrices });
  };

  const handlePriceChange = (idx, value) => {
    setQuotation({
      ...quotation,
      unitPrices: { ...quotation.unitPrices, [idx]: value }
    });
  };

  const calculateTotal = () => {
    if (!selectedRFQ) return 0;
    let total = 0;
    selectedRFQ.items.forEach((item, idx) => {
      const price = parseFloat(quotation.unitPrices[idx]) || 0;
      total += price * item.quantity;
    });
    return total.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Quotation submitted successfully for ${selectedRFQ.id}!`);
    setRfqs(rfqs.map(rfq => 
      rfq.id === selectedRFQ.id ? { ...rfq, hasQuoted: true } : rfq
    ));
    setSelectedRFQ(null);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="quotation-submission">
        <div className="page-header">
          <div>
            <h1>Submit Quotation</h1>
            <p>Respond to RFQs with your pricing</p>
          </div>
        </div>

        {!selectedRFQ ? (
          <div className="rfq-list">
            <h3>Available RFQs</h3>
            <div className="cards-grid">
              {rfqs.map((rfq) => (
                <div key={rfq.id} className="card rfq-card">
                  <div className="rfq-header">
                    <span className="rfq-id">{rfq.id}</span>
                    {rfq.hasQuoted && (
                      <span className="badge badge-success">Quoted</span>
                    )}
                  </div>
                  <h3>{rfq.title}</h3>
                  <div className="rfq-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>Due: {rfq.deadline}</span>
                    </div>
                    <div className="meta-item">
                      <Package size={16} />
                      <span>{rfq.items.length} items</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleSelectRFQ(rfq)}
                    disabled={rfq.hasQuoted}
                  >
                    {rfq.hasQuoted ? 'Already Quoted' : 'Submit Quote'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="quotation-form-container">
            <div className="form-header">
              <button className="btn btn-outline" onClick={() => setSelectedRFQ(null)}>
                ← Back to RFQs
              </button>
              <h2>Submit Quote for {selectedRFQ.id}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card">
                <h3>RFQ Details</h3>
                <p className="subtitle">{selectedRFQ.title}</p>
                <div className="detail-row">
                  <span>Deadline:</span>
                  <strong>{selectedRFQ.deadline}</strong>
                </div>
              </div>

              <div className="card">
                <h3>Item Pricing</h3>
                <div className="pricing-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product/Service</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Unit Price ($)</th>
                        <th>Total ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRFQ.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              placeholder="0.00"
                              value={quotation.unitPrices[idx]}
                              onChange={(e) => handlePriceChange(idx, e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <strong>
                              ${((quotation.unitPrices[idx] || 0) * item.quantity).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
                        <td><strong className="total-price">${calculateTotal()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryTime">
                    <Calendar size={16} />
                    Delivery Timeline *
                  </label>
                  <input
                    type="text"
                    id="deliveryTime"
                    className="form-control"
                    placeholder="e.g., 7-10 business days"
                    value={quotation.deliveryTime}
                    onChange={(e) => setQuotation({ ...quotation, deliveryTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="validityPeriod">Quotation Validity (Days)</label>
                  <input
                    type="number"
                    id="validityPeriod"
                    className="form-control"
                    value={quotation.validityPeriod}
                    onChange={(e) => setQuotation({ ...quotation, validityPeriod: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes / Comments</label>
                <textarea
                  id="notes"
                  className="form-control"
                  placeholder="Add any additional notes, terms, or conditions..."
                  value={quotation.notes}
                  onChange={(e) => setQuotation({ ...quotation, notes: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedRFQ(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={18} />
                  Submit Quotation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default QuotationSubmission;
