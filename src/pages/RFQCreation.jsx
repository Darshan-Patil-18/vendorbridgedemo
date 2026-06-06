import { useState } from 'react';
import Layout from '../components/Layout';
import { Plus, X, Upload, Calendar, Send, Save, Trash2 } from 'lucide-react';
import './RFQCreation.css';

function RFQCreation({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: '',
    priority: 'medium',
  });

  const [items, setItems] = useState([
    { id: 1, product: '', quantity: '', unit: '', specifications: '' }
  ]);

  const [selectedVendors, setSelectedVendors] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const vendors = [
    { id: 1, name: 'Tech Solutions Inc', category: 'IT & Hardware' },
    { id: 2, name: 'Office Mart', category: 'Office Supplies' },
    { id: 3, name: 'Global Suppliers', category: 'General' },
    { id: 4, name: 'Maintenance Pro', category: 'Maintenance' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      product: '', 
      quantity: '', 
      unit: '', 
      specifications: '' 
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const toggleVendor = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files.map(f => ({ id: Date.now(), name: f.name }))]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('RFQ Created Successfully!\n\nRFQ ID: RFQ-' + Date.now() + '\nVendors Notified: ' + selectedVendors.length);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="rfq-creation">
        <div className="page-header">
          <div>
            <h1>Create Request for Quotation (RFQ)</h1>
            <p>Initiate a new procurement request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rfq-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">RFQ Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="e.g., Office Supplies Q1 2026"
                value={formData.title}
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
                  <option value="IT & Hardware">IT & Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Services">Services</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="deadline">
                  <Calendar size={16} />
                  Deadline *
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="form-control"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Provide detailed requirements and specifications..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Items & Specifications</h3>
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className="items-list">
              {items.map((item, index) => (
                <div key={item.id} className="item-card">
                  <div className="item-header">
                    <span className="item-number">Item #{index + 1}</span>
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        className="icon-btn danger" 
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Product/Service Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Laptop Dell XPS 15"
                        value={item.product}
                        onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Unit *</label>
                      <select
                        className="form-control"
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="pieces">Pieces</option>
                        <option value="boxes">Boxes</option>
                        <option value="units">Units</option>
                        <option value="kg">Kilograms</option>
                        <option value="liters">Liters</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Specifications</label>
                    <textarea
                      className="form-control"
                      placeholder="Additional specifications or requirements..."
                      value={item.specifications}
                      onChange={(e) => handleItemChange(item.id, 'specifications', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Select Vendors</h3>
            <div className="vendors-grid">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`vendor-select-card ${selectedVendors.includes(vendor.id) ? 'selected' : ''}`}
                  onClick={() => toggleVendor(vendor.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => {}}
                  />
                  <div>
                    <h4>{vendor.name}</h4>
                    <p>{vendor.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="helper-text">Selected: {selectedVendors.length} vendor(s)</p>
          </div>

          <div className="form-section">
            <h3>Attachments</h3>
            <div className="upload-area">
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileUpload" className="upload-label">
                <Upload size={32} />
                <p>Click to upload files</p>
                <span>PDF, DOC, XLS, Images (Max 10MB)</span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((file) => (
                  <div key={file.id} className="attachment-item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeAttachment(file.id)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline">
              <Save size={18} />
              Save as Draft
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={18} />
              Send RFQ to Vendors
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default RFQCreation;
