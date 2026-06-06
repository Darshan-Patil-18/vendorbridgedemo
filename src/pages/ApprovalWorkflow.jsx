import { useState } from 'react';
import Layout from '../components/Layout';
import { CheckCircle, XCircle, Clock, User, DollarSign, FileText } from 'lucide-react';
import './SharedPages.css';

function ApprovalWorkflow({ user, onLogout }) {
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-001',
      rfqId: 'RFQ-001',
      rfqTitle: 'Office Supplies Q1 2026',
      vendor: 'Global Suppliers',
      amount: 11800,
      submittedBy: 'John Doe',
      submittedDate: '2026-06-05',
      status: 'pending',
      priority: 'medium',
      timeline: [
        { stage: 'Submitted', date: '2026-06-05', status: 'completed' },
        { stage: 'Manager Review', date: '2026-06-06', status: 'current' },
        { stage: 'Final Approval', date: '', status: 'pending' }
      ]
    },
    {
      id: 'APP-002',
      rfqId: 'RFQ-002',
      rfqTitle: 'IT Hardware Procurement',
      vendor: 'Tech Solutions Inc',
      amount: 45000,
      submittedBy: 'Jane Smith',
      submittedDate: '2026-06-04',
      status: 'pending',
      priority: 'high',
      timeline: [
        { stage: 'Submitted', date: '2026-06-04', status: 'completed' },
        { stage: 'Manager Review', date: '2026-06-05', status: 'current' },
        { stage: 'Final Approval', date: '', status: 'pending' }
      ]
    },
    {
      id: 'APP-003',
      rfqId: 'RFQ-003',
      rfqTitle: 'Marketing Services',
      vendor: 'Creative Agency',
      amount: 28500,
      submittedBy: 'Mike Johnson',
      submittedDate: '2026-06-03',
      status: 'approved',
      priority: 'low',
      timeline: [
        { stage: 'Submitted', date: '2026-06-03', status: 'completed' },
        { stage: 'Manager Review', date: '2026-06-04', status: 'completed' },
        { stage: 'Final Approval', date: '2026-06-05', status: 'completed' }
      ]
    }
  ]);

  const [selectedApproval, setSelectedApproval] = useState(null);
  const [remarks, setRemarks] = useState('');

  const handleApprove = (approval) => {
    if (!remarks.trim()) {
      alert('Please add approval remarks');
      return;
    }

    setApprovals(approvals.map(app =>
      app.id === approval.id ? { ...app, status: 'approved' } : app
    ));
    
    alert(`Approval ${approval.id} has been approved!\nProceeding to generate Purchase Order.`);
    setSelectedApproval(null);
    setRemarks('');
  };

  const handleReject = (approval) => {
    if (!remarks.trim()) {
      alert('Please add rejection reason');
      return;
    }

    setApprovals(approvals.map(app =>
      app.id === approval.id ? { ...app, status: 'rejected' } : app
    ));
    
    alert(`Approval ${approval.id} has been rejected.`);
    setSelectedApproval(null);
    setRemarks('');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
      urgent: 'danger'
    };
    return colors[priority];
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return colors[status];
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="approval-workflow">
        <div className="page-header">
          <div>
            <h1>Approval Workflow</h1>
            <p>Review and approve procurement requests</p>
          </div>
        </div>

        {!selectedApproval ? (
          <div className="approvals-list">
            {approvals.map((approval) => (
              <div key={approval.id} className="approval-card card">
                <div className="approval-card-header">
                  <div>
                    <h3>{approval.rfqTitle}</h3>
                    <p className="approval-id">{approval.id} • {approval.rfqId}</p>
                  </div>
                  <div className="badges">
                    <span className={`badge badge-${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </span>
                    <span className={`badge badge-${getStatusColor(approval.status)}`}>
                      {approval.status}
                    </span>
                  </div>
                </div>

                <div className="approval-details">
                  <div className="detail-item">
                    <User size={16} />
                    <div>
                      <span className="label">Vendor</span>
                      <p>{approval.vendor}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <DollarSign size={16} />
                    <div>
                      <span className="label">Amount</span>
                      <p className="amount">${approval.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <User size={16} />
                    <div>
                      <span className="label">Submitted By</span>
                      <p>{approval.submittedBy}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Clock size={16} />
                    <div>
                      <span className="label">Date</span>
                      <p>{approval.submittedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="approval-timeline">
                  {approval.timeline.map((stage, idx) => (
                    <div key={idx} className={`timeline-stage ${stage.status}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <p className="stage-name">{stage.stage}</p>
                        {stage.date && <span className="stage-date">{stage.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {approval.status === 'pending' && (
                  <div className="approval-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => setSelectedApproval(approval)}
                    >
                      Review Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="approval-details-view">
            <button className="btn btn-outline" onClick={() => setSelectedApproval(null)}>
              ← Back to List
            </button>

            <div className="card approval-review">
              <h2>Review Approval Request</h2>
              
              <div className="review-section">
                <h3>Request Details</h3>
                <div className="review-grid">
                  <div>
                    <span className="label">Approval ID</span>
                    <p>{selectedApproval.id}</p>
                  </div>
                  <div>
                    <span className="label">RFQ</span>
                    <p>{selectedApproval.rfqId} - {selectedApproval.rfqTitle}</p>
                  </div>
                  <div>
                    <span className="label">Selected Vendor</span>
                    <p>{selectedApproval.vendor}</p>
                  </div>
                  <div>
                    <span className="label">Total Amount</span>
                    <p className="amount">${selectedApproval.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="label">Submitted By</span>
                    <p>{selectedApproval.submittedBy}</p>
                  </div>
                  <div>
                    <span className="label">Submission Date</span>
                    <p>{selectedApproval.submittedDate}</p>
                  </div>
                </div>
              </div>

              <div className="review-section">
                <h3>Approval Status</h3>
                <div className="approval-timeline horizontal">
                  {selectedApproval.timeline.map((stage, idx) => (
                    <div key={idx} className={`timeline-stage ${stage.status}`}>
                      <div className="timeline-dot">
                        {stage.status === 'completed' && <CheckCircle size={16} />}
                        {stage.status === 'current' && <Clock size={16} />}
                      </div>
                      <div className="timeline-content">
                        <p className="stage-name">{stage.stage}</p>
                        {stage.date && <span className="stage-date">{stage.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="review-section">
                <h3>Add Remarks</h3>
                <textarea
                  className="form-control"
                  placeholder="Enter your remarks, comments, or reasons..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div className="review-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedApproval)}
                >
                  <XCircle size={18} />
                  Reject Request
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleApprove(selectedApproval)}
                >
                  <CheckCircle size={18} />
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ApprovalWorkflow;
