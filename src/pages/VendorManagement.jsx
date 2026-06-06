import { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2,
  X,
  Save,
  Star
} from 'lucide-react';
import './VendorManagement.css';

function VendorManagement({ user, onLogout }) {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Tech Solutions Inc',
      category: 'IT & Hardware',
      email: 'contact@techsolutions.com',
      phone: '+1 234-567-8900',
      gst: 'GST123456789',
      address: '123 Tech Street, Silicon Valley, CA',
      status: 'active',
      rating: 4.5,
      totalOrders: 45
    },
    {
      id: 2,
      name: 'Office Mart',
      category: 'Office Supplies',
      email: 'sales@officemart.com',
      phone: '+1 234-567-8901',
      gst: 'GST987654321',
      address: '456 Business Ave, New York, NY',
      status: 'active',
      rating: 4.2,
      totalOrders: 32
    },
    {
      id: 3,
      name: 'Global Suppliers',
      category: 'General',
      email: 'info@globalsuppliers.com',
      phone: '+1 234-567-8902',
      gst: 'GST456789123',
      address: '789 Commerce Blvd, Boston, MA',
      status: 'active',
      rating: 4.8,
      totalOrders: 67
    },
    {
      id: 4,
      name: 'Maintenance Pro',
      category: 'Maintenance',
      email: 'service@maintenancepro.com',
      phone: '+1 234-567-8903',
      gst: 'GST321654987',
      address: '321 Service Lane, Chicago, IL',
      status: 'inactive',
      rating: 3.9,
      totalOrders: 23
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    gst: '',
    address: '',
    status: 'active'
  });

  const categories = ['IT & Hardware', 'Office Supplies', 'General', 'Maintenance', 'Services'];

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      category: '',
      email: '',
      phone: '',
      gst: '',
      address: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setShowModal(true);
  };

  const handleDeleteVendor = (id) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...formData, id: v.id } : v));
    } else {
      const newVendor = {
        ...formData,
        id: Date.now(),
        rating: 0,
        totalOrders: 0
      };
      setVendors([...vendors, newVendor]);
    }
    
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? '#f59e0b' : 'none'}
            stroke={star <= rating ? '#f59e0b' : '#94a3b8'}
          />
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="vendor-management">
        <div className="page-header">
          <div>
            <h1>Vendor Management</h1>
            <p>Manage and track your supplier relationships</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddVendor}>
            <Plus size={18} />
            Add Vendor
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={18} />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="vendors-grid">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <div className="vendor-header">
                <div className="vendor-icon">
                  <Building2 size={24} />
                </div>
                <div className="vendor-actions">
                  <button className="icon-btn" onClick={() => handleEditVendor(vendor)}>
                    <Edit size={16} />
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDeleteVendor(vendor.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="vendor-info">
                <h3>{vendor.name}</h3>
                <span className={`badge badge-${vendor.status === 'active' ? 'success' : 'danger'}`}>
                  {vendor.status}
                </span>
              </div>

              <div className="vendor-category">
                {vendor.category}
              </div>

              {renderStars(vendor.rating)}

              <div className="vendor-details">
                <div className="detail-item">
                  <Mail size={14} />
                  <span>{vendor.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={14} />
                  <span>{vendor.phone}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={14} />
                  <span>{vendor.address}</span>
                </div>
              </div>

              <div className="vendor-stats">
                <div className="stat-item">
                  <span className="stat-label">GST Number</span>
                  <span className="stat-value">{vendor.gst}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{vendor.totalOrders}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="empty-state">
            <Building2 size={48} />
            <h3>No vendors found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                <button className="icon-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name">Vendor Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">Status *</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gst">GST Number *</label>
                    <input
                      type="text"
                      id="gst"
                      name="gst"
                      className="form-control"
                      value={formData.gst}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VendorManagement;
