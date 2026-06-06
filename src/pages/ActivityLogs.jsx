import { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Activity, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Send, 
  User,
  Filter,
  Calendar
} from 'lucide-react';
import './SharedPages.css';

function ActivityLogs({ user, onLogout }) {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'rfq_created',
      title: 'RFQ Created',
      description: 'New RFQ "Office Supplies Q1 2026" created',
      user: 'John Doe',
      timestamp: '2026-06-06 10:30 AM',
      icon: FileText,
      color: 'primary'
    },
    {
      id: 2,
      type: 'quotation_submitted',
      title: 'Quotation Received',
      description: 'Global Suppliers submitted quotation for RFQ-001',
      user: 'Global Suppliers',
      timestamp: '2026-06-06 09:15 AM',
      icon: Send,
      color: 'info'
    },
    {
      id: 3,
      type: 'approval_approved',
      title: 'Approval Granted',
      description: 'APP-001 approved by Manager',
      user: 'Jane Smith (Manager)',
      timestamp: '2026-06-05 04:30 PM',
      icon: CheckCircle,
      color: 'success'
    },
    {
      id: 4,
      type: 'po_generated',
      title: 'Purchase Order Generated',
      description: 'PO-2026-001 generated for Global Suppliers',
      user: 'System',
      timestamp: '2026-06-05 04:35 PM',
      icon: FileText,
      color: 'success'
    },
    {
      id: 5,
      type: 'quotation_submitted',
      title: 'Quotation Received',
      description: 'Tech Solutions Inc submitted quotation for RFQ-002',
      user: 'Tech Solutions Inc',
      timestamp: '2026-06-05 02:20 PM',
      icon: Send,
      color: 'info'
    },
    {
      id: 6,
      type: 'rfq_created',
      title: 'RFQ Created',
      description: 'New RFQ "IT Hardware Procurement" created',
      user: 'Mike Johnson',
      timestamp: '2026-06-05 11:00 AM',
      icon: FileText,
      color: 'primary'
    },
    {
      id: 7,
      type: 'approval_rejected',
      title: 'Approval Rejected',
      description: 'APP-005 rejected due to budget constraints',
      user: 'David Wilson (Manager)',
      timestamp: '2026-06-04 03:45 PM',
      icon: XCircle,
      color: 'danger'
    },
    {
      id: 8,
      type: 'vendor_added',
      title: 'New Vendor Added',
      description: 'Maintenance Pro registered as new vendor',
      user: 'Admin',
      timestamp: '2026-06-04 10:15 AM',
      icon: User,
      color: 'success'
    },
    {
      id: 9,
      type: 'invoice_sent',
      title: 'Invoice Sent',
      description: 'Invoice INV-2026-001 sent to Global Suppliers',
      user: 'System',
      timestamp: '2026-06-03 05:00 PM',
      icon: Send,
      color: 'info'
    },
    {
      id: 10,
      type: 'quotation_submitted',
      title: 'Quotation Received',
      description: 'Office Mart submitted quotation for RFQ-001',
      user: 'Office Mart',
      timestamp: '2026-06-03 02:30 PM',
      icon: Send,
      color: 'info'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    // Date filtering can be implemented with actual date comparison
    return true;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'rfq_created', label: 'RFQ Created' },
    { value: 'quotation_submitted', label: 'Quotations' },
    { value: 'approval_approved', label: 'Approvals' },
    { value: 'approval_rejected', label: 'Rejections' },
    { value: 'po_generated', label: 'Purchase Orders' },
    { value: 'invoice_sent', label: 'Invoices' },
    { value: 'vendor_added', label: 'Vendor Changes' }
  ];

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="activity-logs">
        <div className="page-header">
          <div>
            <h1>Activity Logs & Notifications</h1>
            <p>Track all procurement activities and updates</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <Filter size={18} />
            <select
              className="form-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Calendar size={18} />
            <select
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="activity-timeline">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon icon-${activity.color}`}>
                  <Icon size={20} />
                </div>
                
                <div className="activity-content">
                  <div className="activity-header">
                    <h4>{activity.title}</h4>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-user">
                    <User size={14} />
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="empty-state">
            <Activity size={48} />
            <h3>No activities found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ActivityLogs;
