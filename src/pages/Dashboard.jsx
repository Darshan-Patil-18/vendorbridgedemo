import Layout from '../components/Layout';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Users, 
  ShoppingCart,
  AlertCircle,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  // Sample data
  const stats = [
    {
      label: 'Total RFQs',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'primary'
    },
    {
      label: 'Pending Approvals',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: Clock,
      color: 'warning'
    },
    {
      label: 'Active Vendors',
      value: '89',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'success'
    },
    {
      label: 'Total Spend',
      value: '$2.4M',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'info'
    }
  ];

  const recentRFQs = [
    { id: 'RFQ-001', title: 'Office Supplies Q1 2026', status: 'pending', deadline: '2026-06-15', vendors: 5 },
    { id: 'RFQ-002', title: 'IT Hardware Procurement', status: 'in_review', deadline: '2026-06-20', vendors: 8 },
    { id: 'RFQ-003', title: 'Marketing Services', status: 'approved', deadline: '2026-06-10', vendors: 3 },
    { id: 'RFQ-004', title: 'Facility Maintenance', status: 'pending', deadline: '2026-06-25', vendors: 6 },
  ];

  const recentPOs = [
    { id: 'PO-2024-001', vendor: 'Tech Solutions Inc', amount: '$45,000', date: '2026-06-05', status: 'completed' },
    { id: 'PO-2024-002', vendor: 'Office Mart', amount: '$12,500', date: '2026-06-04', status: 'in_progress' },
    { id: 'PO-2024-003', vendor: 'Global Suppliers', amount: '$28,900', date: '2026-06-03', status: 'completed' },
  ];

  const pendingApprovals = [
    { id: 'APP-001', rfq: 'RFQ-001', amount: '$34,500', submittedBy: 'John Doe', date: '2026-06-05' },
    { id: 'APP-002', rfq: 'RFQ-004', amount: '$67,200', submittedBy: 'Jane Smith', date: '2026-06-04' },
    { id: 'APP-003', rfq: 'RFQ-007', amount: '$21,800', submittedBy: 'Mike Johnson', date: '2026-06-03' },
  ];

  const monthlySpend = [
    { month: 'Jan', amount: 180000 },
    { month: 'Feb', amount: 220000 },
    { month: 'Mar', amount: 195000 },
    { month: 'Apr', amount: 245000 },
    { month: 'May', amount: 210000 },
    { month: 'Jun', amount: 240000 },
  ];

  const categorySpend = [
    { name: 'IT & Hardware', value: 450000 },
    { name: 'Office Supplies', value: 180000 },
    { name: 'Services', value: 320000 },
    { name: 'Maintenance', value: 150000 },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'warning',
      in_review: 'info',
      approved: 'success',
      completed: 'success',
      in_progress: 'primary',
      rejected: 'danger'
    };
    return statusMap[status] || 'info';
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.name}! 👋</h1>
            <p>Here's what's happening with your procurement today</p>
          </div>
          <div className="header-actions">
            <Link to="/rfq/create" className="btn btn-primary">
              <Plus size={18} />
              Create RFQ
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change positive">
                    <TrendingUp size={14} />
                    <span>{stat.change} from last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="card chart-card">
            <div className="card-header">
              <h3>Monthly Procurement Spend</h3>
              <span className="chart-subtitle">Last 6 months</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <h3>Category Distribution</h3>
              <span className="chart-subtitle">Current fiscal year</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpend}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categorySpend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent RFQs */}
          <div className="card">
            <div className="card-header">
              <h3>Recent RFQs</h3>
              <Link to="/rfq/create" className="view-all">View All <ArrowUpRight size={16} /></Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Vendors</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRFQs.map((rfq) => (
                    <tr key={rfq.id}>
                      <td><strong>{rfq.id}</strong></td>
                      <td>{rfq.title}</td>
                      <td>
                        <span className={`badge badge-${getStatusBadge(rfq.status)}`}>
                          {rfq.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{rfq.deadline}</td>
                      <td>{rfq.vendors} vendors</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals */}
          {(user.role === 'manager' || user.role === 'admin') && (
            <div className="card">
              <div className="card-header">
                <h3>Pending Approvals</h3>
                <Link to="/approvals" className="view-all">View All <ArrowUpRight size={16} /></Link>
              </div>
              <div className="approval-list">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="approval-item">
                    <div className="approval-icon">
                      <AlertCircle size={20} />
                    </div>
                    <div className="approval-info">
                      <h4>{approval.rfq}</h4>
                      <p>Amount: {approval.amount} • By: {approval.submittedBy}</p>
                      <span className="approval-date">{approval.date}</span>
                    </div>
                    <div className="approval-actions">
                      <button className="btn btn-sm btn-secondary">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Purchase Orders */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Purchase Orders</h3>
              <Link to="/purchase-orders" className="view-all">View All <ArrowUpRight size={16} /></Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPOs.map((po) => (
                    <tr key={po.id}>
                      <td><strong>{po.id}</strong></td>
                      <td>{po.vendor}</td>
                      <td><strong>{po.amount}</strong></td>
                      <td>{po.date}</td>
                      <td>
                        <span className={`badge badge-${getStatusBadge(po.status)}`}>
                          {po.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <Link to="/rfq/create" className="quick-action-btn">
                <FileText size={24} />
                <span>Create RFQ</span>
              </Link>
              <Link to="/vendors" className="quick-action-btn">
                <Users size={24} />
                <span>Manage Vendors</span>
              </Link>
              <Link to="/quotations/compare" className="quick-action-btn">
                <CheckCircle size={24} />
                <span>Compare Quotes</span>
              </Link>
              <Link to="/purchase-orders" className="quick-action-btn">
                <ShoppingCart size={24} />
                <span>View Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
