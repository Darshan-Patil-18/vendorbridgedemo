import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import './Auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Determine role based on email for demo
        let role = 'procurement_officer';
        if (formData.email.includes('admin')) role = 'admin';
        else if (formData.email.includes('vendor')) role = 'vendor';
        else if (formData.email.includes('manager')) role = 'manager';

        const userData = {
          id: Date.now(),
          name: formData.email.split('@')[0],
          email: formData.email,
          role: role
        };

        onLogin(userData);
      } else {
        setError('Please enter valid credentials');
        setLoading(false);
      }
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const quickLogin = (email, role) => {
    setFormData({ email, password: 'demo123' });
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: role
      };
      onLogin(userData);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-large">
            <ShoppingCart size={48} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your VendorBridge account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-title">Quick Login (Demo)</p>
          <div className="quick-login-buttons">
            <button onClick={() => quickLogin('admin@vendor.com', 'admin')} className="btn btn-outline btn-sm">
              Admin
            </button>
            <button onClick={() => quickLogin('manager@vendor.com', 'manager')} className="btn btn-outline btn-sm">
              Manager
            </button>
            <button onClick={() => quickLogin('officer@vendor.com', 'procurement_officer')} className="btn btn-outline btn-sm">
              Officer
            </button>
            <button onClick={() => quickLogin('vendor@vendor.com', 'vendor')} className="btn btn-outline btn-sm">
              Vendor
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="link">Sign Up</Link></p>
        </div>
      </div>

      <div className="auth-background">
        <div className="gradient-ball ball-1"></div>
        <div className="gradient-ball ball-2"></div>
        <div className="gradient-ball ball-3"></div>
      </div>
    </div>
  );
}

export default Login;
