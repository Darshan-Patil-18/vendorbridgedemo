import { useState } from 'react';
import Layout from '../components/Layout';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Users, FileText } from 'lucide-react';
import './SharedPages.css';

function Reports({ user, onLogout }) {
  const [dateRange, setDateRange] = useState('6months');

  // Sample Data
  const monthlySpending = [
    { month: 'Jan', spending: 180000, orders: 25 },
    { month: 'Feb', spending: 220000, orders: 32 },
    { month: 'Mar', spending: 195000, orders: 28 },
    { month: 'Apr', spending: 245000, orders: 35 },
    { month: 'May', spending: 210000, orders: 30 },
    { month: 'Jun', spending: 240000, orders: 33 }
  ];

  const categoryBreakdown = [
    { name: 'IT & Hardware', value: 450000, orders: 45 },
    { name: 'Office Supplies', value: 180000, orders: 67 },
    { name: 'Services', value: 320000, orders: 28 },
    { name: 'Maintenance', value: 150000, orders: 23 },
    { name: 'Marketing', value: 190000, orders: 19 }
  ];

  const vendorPerformance = [
    { vendor: 'Tech Solutions Inc', orders: 45, avgDelivery: 5, rating: 4.5, totalSpend: 450000 },
    { vendor: 'Office Mart', orders: 67, avgDelivery: 3, rating: 4.2, totalSpend: 180000 },
    { vendor: 'Global Suppliers', orders: 52, avgDelivery: 7, rating: 4.8, totalSpend: 320000 },
    { vendor: 'Maintenance Pro', orders: 23, avgDelivery: 10, rating: 3.9, totalSpend: 150000 },
    { vendor: 'Quick Services', orders: 31, avgDelivery: 4, rating: 4.3, totalSpend: 190000 }
  ];

  const procurementStats = [
    { label: 'Total Spend (YTD)', value: '$1.29M', change: '+18%', icon: DollarSign, color: 'primary' },
    { label: 'Active Vendors', value: '89', change: '+12', icon: Users, color: 'success' },
    { label: 'Total Orders', value: '183', change: '+23%', icon: FileText, color: 'info' },
    { label: 'Avg Order Value', value: '$7,049', change: '+8%', icon: TrendingUp, color: 'warning' }
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExport = (format) => {
    alert(`Exporting report in ${format.toUpperCase()} format...`);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="reports">
        <div className="page-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Comprehensive procurement insights and trends</p>
          </div>
          <div className="header-actions">
            <select
              className="form-control"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <button className="btn btn-primary" onClick={() => handleExport('pdf')}>
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid">
          {procurementStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change positive">
                    <TrendingUp size={14} />
                    <span>{stat.change} from last period</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="card chart-card">
            <div className="card-header">
              <h3>Monthly Procurement Trends</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: '#2563eb' }}></span>
                  Spending
                </span>
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: '#10b981' }}></span>
                  Orders
                </span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e293b', 
                      border: '1px solid #334155', 
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <h3>Category Distribution</h3>
              <span className="chart-subtitle">By spending amount</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e293b', 
                      border: '1px solid #334155', 
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card full-width">
            <div className="card-header">
              <h3>Category Spending Overview</h3>
              <span className="chart-subtitle">Total spending by category</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e293b', 
                      border: '1px solid #334155', 
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vendor Performance Table */}
        <div className="card">
          <div className="card-header">
            <h3>Vendor Performance Analytics</h3>
            <button className="btn btn-sm btn-outline" onClick={() => handleExport('csv')}>
              <Download size={16} />
              Export CSV
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Total Orders</th>
                  <th>Total Spend</th>
                  <th>Avg Delivery (days)</th>
                  <th>Rating</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {vendorPerformance.map((vendor, idx) => (
                  <tr key={idx}>
                    <td><strong>{vendor.vendor}</strong></td>
                    <td>{vendor.orders}</td>
                    <td><strong>${vendor.totalSpend.toLocaleString()}</strong></td>
                    <td>{vendor.avgDelivery} days</td>
                    <td>
                      <div className="rating-display">
                        <span>⭐ {vendor.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="performance-bar">
                        <div 
                          className="performance-fill" 
                          style={{ 
                            width: `${(vendor.rating / 5) * 100}%`,
                            background: vendor.rating >= 4.5 ? '#10b981' : vendor.rating >= 4.0 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="card summary-card">
            <h4>Top Performing Category</h4>
            <p className="summary-value">IT & Hardware</p>
            <p className="summary-detail">$450,000 • 45 orders</p>
          </div>

          <div className="card summary-card">
            <h4>Most Active Vendor</h4>
            <p className="summary-value">Office Mart</p>
            <p className="summary-detail">67 orders • 4.2⭐ rating</p>
          </div>

          <div className="card summary-card">
            <h4>Average Order Processing</h4>
            <p className="summary-value">6.2 days</p>
            <p className="summary-detail">From RFQ to PO generation</p>
          </div>

          <div className="card summary-card">
            <h4>Cost Savings</h4>
            <p className="summary-value">$127,500</p>
            <p className="summary-detail">Through quotation comparison</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;
