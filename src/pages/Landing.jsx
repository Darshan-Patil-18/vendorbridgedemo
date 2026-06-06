import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  GitCompare, 
  CheckCircle, 
  ShoppingBag,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import './Landing.css';

function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Centralize vendor data, track performance, and manage relationships efficiently'
    },
    {
      icon: FileText,
      title: 'RFQ Creation',
      description: 'Create detailed procurement requests and send them to multiple vendors instantly'
    },
    {
      icon: GitCompare,
      title: 'Quotation Comparison',
      description: 'Compare vendor quotes side-by-side to make informed purchasing decisions'
    },
    {
      icon: CheckCircle,
      title: 'Approval Workflow',
      description: 'Streamline multi-stage approvals with automated routing and notifications'
    },
    {
      icon: ShoppingBag,
      title: 'Purchase Orders & Invoices',
      description: 'Generate, manage, and track POs and invoices with automated calculations'
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Gain insights with real-time analytics and comprehensive procurement reports'
    }
  ];

  const steps = [
    { number: 1, title: 'Create RFQ', description: 'Define your procurement needs' },
    { number: 2, title: 'Vendors Submit Quotes', description: 'Receive competitive proposals' },
    { number: 3, title: 'Compare & Approve', description: 'Select the best vendor' },
    { number: 4, title: 'Generate PO & Invoice', description: 'Complete the transaction' }
  ];

  const roles = [
    {
      title: 'Admin',
      icon: Shield,
      permissions: ['Full system access', 'Manage users & vendors', 'View all analytics', 'Configure workflows']
    },
    {
      title: 'Procurement Officer',
      icon: FileText,
      permissions: ['Create & manage RFQs', 'Compare quotations', 'Generate purchase orders', 'Manage vendors']
    },
    {
      title: 'Manager',
      icon: CheckCircle,
      permissions: ['Approve/reject requests', 'Monitor workflows', 'View reports', 'Track procurement']
    },
    {
      title: 'Vendor',
      icon: Users,
      permissions: ['Submit quotations', 'Track RFQ status', 'View purchase orders', 'Manage profile']
    }
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`navbar ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">
            <ShoppingCart className="logo-icon" />
            <span>VendorBridge</span>
          </Link>
          <div className="nav-buttons">
            <Link to="/login" className="btn-secondary">Sign In</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title fade-in-up">
            Smarter Procurement, <span className="gradient-text">Simplified</span>
          </h1>
          <p className="hero-subtitle fade-in-up delay-1">
            The complete ERP solution for managing vendors, RFQs, quotations, approvals, 
            purchase orders, and invoices — all in one powerful platform
          </p>
          <div className="hero-cta fade-in-up delay-2">
            <Link to="/signup" className="btn-hero">
              Get Started Free
              <ArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="hero-stats fade-in-up delay-3">
            <div className="stat">
              <Zap className="stat-icon" />
              <span>50% Faster Procurement</span>
            </div>
            <div className="stat">
              <TrendingUp className="stat-icon" />
              <span>30% Cost Savings</span>
            </div>
            <div className="stat">
              <Shield className="stat-icon" />
              <span>100% Transparent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need for Procurement Excellence</h2>
            <p className="section-subtitle">
              Powerful features designed to streamline your entire procurement workflow
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Four simple steps to transform your procurement process
            </p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-wrapper">
                <div className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-arrow">
                    <ChevronRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Built for Every Role</h2>
            <p className="section-subtitle">
              Tailored access and permissions for your entire procurement team
            </p>
          </div>
          <div className="roles-grid">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="role-card">
                  <div className="role-header">
                    <Icon className="role-icon" />
                    <h3 className="role-title">{role.title}</h3>
                  </div>
                  <ul className="role-permissions">
                    {role.permissions.map((permission, idx) => (
                      <li key={idx}>
                        <CheckCircle className="check-icon" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Streamline Your Procurement?</h2>
          <p className="cta-subtitle">
            Join leading organizations that trust VendorBridge for smarter procurement management
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-cta-primary">
              Get Started
              <ArrowRight className="ml-2" />
            </Link>
            <Link to="/login" className="btn-cta-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <Link to="/" className="footer-logo">
              <ShoppingCart className="footer-logo-icon" />
              <span>VendorBridge</span>
            </Link>
            <p className="footer-copyright">
              © 2026 VendorBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
