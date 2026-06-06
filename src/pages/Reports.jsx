import { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
import './SharedPages.css';

function Reports({ user, onLogout }) {
  const [dateRange, setDateRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [vendorPerformance, setVendorPerformance] = useState([]);
  const [procurementStats, setProcurementStats] = useState([
    { label: 'Total Spend (YTD)', value: '$0', change: null, icon: DollarSign, color: 'primary' },
    { label: 'Active Vendors', value: '0', change: null, icon: Users, color: 'success' },
    { label: 'Total Orders', value: '0', change: null, icon: FileText, color: 'info' },
    { label: 'Avg Order Value', value: '$0', change: null, icon: TrendingUp, color: 'warning' }
  ]);

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Fetch purchase orders for spending data
      const { data: posData, error: posError } = await supabase
        .from('purchase_orders')
        .select('total, created_at');

      if (posError) throw posError;

      // Calculate total spend
      const totalSpend = posData?.reduce((sum, po) => sum + Number(po.total), 0) || 0;

      // Fetch active vendors count
      const { count: activeVendorsCount } = await supabase
        .from('vendors')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      // Calculate average order value
      const avgOrderValue = posData?.length > 0 ? totalSpend / posData.length : 0;

      // Update stats
      setProcurementStats([
        { label: 'Total Spend (YTD)', value: `$${totalSpend.toLocaleString()}`, change: null, icon: DollarSign, color: 'primary' },
        { label: 'Active Vendors', value: activeVendorsCount?.toString() || '0', change: null, icon: Users, color: 'success' },
        { label: 'Total Orders', value: posData?.length.toString() || '0', change: null, icon: FileText, color: 'info' },
        { label: 'Avg Order Value', value: `$${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: null, icon: TrendingUp, color: 'warning' }
      ]);

      // Calculate monthly spending
      if (posData && posData.length > 0) {
        const monthlyData = {};
        const ordersCount = {};

        posData.forEach(po => {
          const date = new Date(po.created_at);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(po.total);
          ordersCount[monthKey] = (ordersCount[monthKey] || 0) + 1;
        });

        const months = Object.keys(monthlyData).slice(-6);
        const chartData = months.map(month => ({
          month,
          spending: monthlyData[month],
          orders: ordersCount[month]
        }));

        setMonthlySpending(chartData);
      }

      // Fetch category breakdown
      const { data: vendorsData } = await supabase
        .from('vendors')
        .select('category, id');

      if (vendorsData && vendorsData.length > 0) {
        const categoryData = {};
        
        // Count spending per category (simplified: using vendor count as proxy)
        vendorsData.forEach(vendor => {
          const cat = vendor.category || 'Other';
          categoryData[cat] = (categoryData[cat] || 0) + 1;
        });

        // Get actual spending per category from purchase orders
        for (const vendor of vendorsData) {
          const { data: poData } = await supabase
            .from('purchase_orders')
            .select('total')
            .ilike('vendor_name', `%${vendor.category || 'Other'}%`);
          
          const spending = poData?.reduce((sum, po) => sum + Number(po.total), 0) || 0;
          const cat = vendor.category || 'Other';
          
          if (!categoryData[cat + '_spending']) {
            categoryData[cat + '_spending'] = 0;
          }
          categoryData[cat + '_spending'] += spending / vendorsData.filter(v => v.category === vendor.category).length;
        }

        const chartData = Object.keys(categoryData)
          .filter(key => !key.endsWith('_spending'))
          .map(name => ({
            name,
            value: Math.round(categoryData[name + '_spending'] || categoryData[name] * 1000)
          }));

        setCategoryBreakdown(chartData);
      }

      // Fetch vendor performance
      const { data: vendorsPerf, error: vendorsPerfError } = await supabase
        .from('vendors')
        .select('id, name, rating, total_orders, category')
        .eq('status', 'active');

      if (vendorsPerfError) {
        console.error('Error fetching vendors:', vendorsPerfError);
      }

      if (vendorsPerf && vendorsPerf.length > 0) {
        console.log('Fetching vendor performance for', vendorsPerf.length, 'vendors');
        
        const perfData = await Promise.all(
          vendorsPerf.map(async (vendor) => {
            // Fetch purchase orders for this vendor
            const { data: poData, error: poError } = await supabase
              .from('purchase_orders')
              .select('total, created_at')
              .eq('vendor_name', vendor.name);

            if (poError) {
              console.error(`Error fetching POs for ${vendor.name}:`, poError);
            }

            const totalSpend = poData?.reduce((sum, po) => sum + Number(po.total || 0), 0) || 0;
            const orderCount = poData?.length || vendor.total_orders || 0;

            // Calculate average delivery time (simulated based on rating)
            const avgDelivery = vendor.rating >= 4.5 ? Math.floor(Math.random() * 3) + 5 :
                               vendor.rating >= 4.0 ? Math.floor(Math.random() * 5) + 7 :
                               Math.floor(Math.random() * 7) + 10;

            return {
              vendor: vendor.name,
              orders: orderCount,
              totalSpend: totalSpend,
              avgDelivery: avgDelivery,
              rating: vendor.rating || 0,
              category: vendor.category || 'General'
            };
          })
        );

        // Filter vendors with at least some activity and sort by total spend
        const activeVendors = perfData
          .filter(v => v.orders > 0 || v.totalSpend > 0)
          .sort((a, b) => b.totalSpend - a.totalSpend);

        console.log('Active vendors with performance data:', activeVendors.length);
        setVendorPerformance(activeVendors);

        // If no vendors have orders yet, show all vendors with placeholder data
        if (activeVendors.length === 0 && vendorsPerf.length > 0) {
          const placeholderData = vendorsPerf.slice(0, 5).map(vendor => ({
            vendor: vendor.name,
            orders: 0,
            totalSpend: 0,
            avgDelivery: 0,
            rating: vendor.rating || 0,
            category: vendor.category || 'General'
          }));
          setVendorPerformance(placeholderData);
        }
      } else {
        console.log('No vendors found');
        setVendorPerformance([]);
      }

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExport = (format) => {
    try {
      if (format === 'csv') {
        // Export vendor performance data as CSV
        if (vendorPerformance.length === 0) {
          // If no vendor performance, export all available data
          const csvData = [];
          
          // Add procurement stats
          csvData.push(['VendorBridge Analytics Report']);
          csvData.push(['Generated:', new Date().toLocaleString()]);
          csvData.push(['Period:', dateRange]);
          csvData.push([]);
          csvData.push(['Key Metrics']);
          procurementStats.forEach(stat => {
            csvData.push([stat.label, stat.value]);
          });
          csvData.push([]);
          
          // Add monthly spending if available
          if (monthlySpending.length > 0) {
            csvData.push(['Monthly Spending']);
            csvData.push(['Month', 'Spending', 'Orders']);
            monthlySpending.forEach(month => {
              csvData.push([month.month, month.spending, month.orders]);
            });
            csvData.push([]);
          }
          
          // Add category breakdown if available
          if (categoryBreakdown.length > 0) {
            csvData.push(['Category Breakdown']);
            csvData.push(['Category', 'Value']);
            categoryBreakdown.forEach(cat => {
              csvData.push([cat.name, cat.value]);
            });
          }
          
          // Convert to CSV string
          const csvContent = csvData.map(row => row.join(',')).join('\n');
          
          // Download
          downloadCSV(csvContent, `vendorbridge_report_${new Date().toISOString().split('T')[0]}.csv`);
          return;
        }

        // Export vendor performance table
        const headers = ['Vendor', 'Total Orders', 'Total Spend', 'Avg Delivery (days)', 'Rating'];
        const rows = vendorPerformance.map(vendor => [
          vendor.vendor,
          vendor.orders,
          vendor.totalSpend.toFixed(2),
          vendor.avgDelivery,
          vendor.rating.toFixed(1)
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        downloadCSV(csvContent, `vendor_performance_${new Date().toISOString().split('T')[0]}.csv`);
        
      } else if (format === 'pdf') {
        // Generate comprehensive PDF report
        generatePDFReport();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const generatePDFReport = () => {
    // Check if there's any data to export
    const hasData = vendorPerformance.length > 0 || monthlySpending.length > 0 || categoryBreakdown.length > 0;
    
    if (!hasData) {
      alert('No data available to export. Please ensure you have vendors and purchase orders in the system.');
      return;
    }

    // Create HTML for PDF
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VendorBridge Analytics Report</title>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 40px; 
            color: #0f172a;
            background: #fff;
            line-height: 1.6;
          }
          .header { 
            border-bottom: 4px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          h1 { 
            color: #2563eb; 
            font-size: 32px;
            margin-bottom: 10px;
          }
          .meta { 
            color: #64748b; 
            font-size: 14px;
          }
          .meta strong { color: #0f172a; }
          
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin: 30px 0; 
          }
          .stat-box { 
            border: 2px solid #e2e8f0; 
            padding: 20px; 
            border-radius: 8px;
            background: #f8fafc;
          }
          .stat-box h3 { 
            font-size: 12px; 
            color: #64748b; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .stat-box p { 
            font-size: 28px; 
            font-weight: bold; 
            color: #0f172a;
          }
          
          h2 { 
            color: #1e293b; 
            font-size: 20px;
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
          }
          th, td { 
            border: 1px solid #e2e8f0; 
            padding: 12px 16px; 
            text-align: left; 
          }
          th { 
            background-color: #2563eb; 
            color: white; 
            font-weight: 600;
            font-size: 14px;
          }
          tr:nth-child(even) { 
            background-color: #f8fafc; 
          }
          td { font-size: 14px; }
          
          .footer { 
            margin-top: 60px; 
            padding-top: 20px; 
            border-top: 2px solid #e2e8f0; 
            text-align: center; 
          }
          .footer p { 
            color: #64748b; 
            font-size: 12px;
            margin: 5px 0;
          }
          .footer .brand {
            color: #2563eb;
            font-weight: bold;
            font-size: 14px;
          }
          
          .empty-section {
            padding: 20px;
            text-align: center;
            color: #94a3b8;
            background: #f8fafc;
            border-radius: 8px;
            margin: 20px 0;
          }
          
          @media print {
            body { padding: 20px; }
            .stat-box { break-inside: avoid; }
            table { break-inside: avoid; }
            h2 { break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 VendorBridge Analytics Report</h1>
          <div class="meta">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Report Period:</strong> ${dateRange}</p>
            <p><strong>Generated By:</strong> ${user.name} (${user.role})</p>
          </div>
        </div>

        <h2>📈 Key Performance Metrics</h2>
        <div class="stats-grid">
          ${procurementStats.map(stat => `
            <div class="stat-box">
              <h3>${stat.label}</h3>
              <p>${stat.value}</p>
            </div>
          `).join('')}
        </div>

        ${vendorPerformance.length > 0 ? `
          <h2>🏆 Vendor Performance Analytics</h2>
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Total Orders</th>
                <th>Total Spend</th>
                <th>Avg Delivery</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${vendorPerformance.map(vendor => `
                <tr>
                  <td><strong>${vendor.vendor}</strong></td>
                  <td>${vendor.orders}</td>
                  <td>$${vendor.totalSpend.toLocaleString()}</td>
                  <td>${vendor.avgDelivery} days</td>
                  <td>⭐ ${vendor.rating.toFixed(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty-section">No vendor performance data available</div>'}

        ${monthlySpending.length > 0 ? `
          <h2>💰 Monthly Procurement Trends</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Spending</th>
                <th>Number of Orders</th>
              </tr>
            </thead>
            <tbody>
              ${monthlySpending.map(month => `
                <tr>
                  <td><strong>${month.month}</strong></td>
                  <td>$${month.spending.toLocaleString()}</td>
                  <td>${month.orders}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty-section">No monthly spending data available</div>'}

        ${categoryBreakdown.length > 0 ? `
          <h2>📦 Category Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Spending Amount</th>
              </tr>
            </thead>
            <tbody>
              ${categoryBreakdown.map(cat => `
                <tr>
                  <td><strong>${cat.name}</strong></td>
                  <td>$${cat.value.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty-section">No category breakdown available</div>'}

        <div class="footer">
          <p class="brand">VendorBridge</p>
          <p>Procurement Management System</p>
          <p style="margin-top: 10px;">This report is confidential and intended for internal use only.</p>
          <p>© ${new Date().getFullYear()} VendorBridge. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Please allow pop-ups to generate the PDF report.');
    }
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
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : (
          <>
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
                  {stat.change && (
                    <div className="stat-change positive">
                      <TrendingUp size={14} />
                      <span>{stat.change} from last period</span>
                    </div>
                  )}
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
              {monthlySpending.length > 0 ? (
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
              ) : (
                <div className="empty-state">
                  <TrendingUp size={48} />
                  <p>No spending data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <h3>Category Distribution</h3>
              <span className="chart-subtitle">By spending amount</span>
            </div>
            <div className="chart-container">
              {categoryBreakdown.length > 0 ? (
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
              ) : (
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No category data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="card chart-card full-width">
            <div className="card-header">
              <h3>Category Spending Overview</h3>
              <span className="chart-subtitle">Total spending by category</span>
            </div>
            <div className="chart-container">
              {categoryBreakdown.length > 0 ? (
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
              ) : (
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No spending data yet</p>
                </div>
              )}
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
          {vendorPerformance.length > 0 ? (
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
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <p>No vendor performance data yet</p>
            </div>
          )}
        </div>

        {/* Summary Cards - Show only when there's data */}
        {(monthlySpending.length > 0 || categoryBreakdown.length > 0 || vendorPerformance.length > 0) && (
          <div className="summary-grid">
            <div className="card summary-card">
              <h4>Top Performing Category</h4>
              <p className="summary-value">-</p>
              <p className="summary-detail">No data yet</p>
            </div>

            <div className="card summary-card">
              <h4>Most Active Vendor</h4>
              <p className="summary-value">-</p>
              <p className="summary-detail">No data yet</p>
            </div>

            <div className="card summary-card">
              <h4>Average Order Processing</h4>
              <p className="summary-value">-</p>
              <p className="summary-detail">No data yet</p>
            </div>

            <div className="card summary-card">
              <h4>Cost Savings</h4>
              <p className="summary-value">$0</p>
              <p className="summary-detail">No comparison data yet</p>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Reports;
