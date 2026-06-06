# VendorBridge Landing Page

## Overview
A stunning, modern, scrollable landing page for VendorBridge - a Procurement & Vendor Management ERP platform.

## Features Implemented

### 1. **Navbar** (Fixed Header)
- VendorBridge logo on the left with ShoppingCart icon
- "Sign In" button → routes to `/#/login`
- "Get Started" button → routes to `/#/signup`
- Smooth scroll effect with backdrop blur
- Responsive design

### 2. **Hero Section**
- Large bold headline: "Smarter Procurement, Simplified"
- Descriptive subheading explaining the ERP platform
- "Get Started Free" CTA button → routes to `/#/signup`
- Animated gradient orbs in background
- Stats display showing key benefits (50% Faster, 30% Cost Savings, 100% Transparent)
- Smooth fade-in animations

### 3. **Features Section** (6 Feature Cards)
1. **Vendor Management** - Centralize vendor data and track performance
2. **RFQ Creation** - Create and send procurement requests
3. **Quotation Comparison** - Compare vendor quotes side-by-side
4. **Approval Workflow** - Streamline multi-stage approvals
5. **Purchase Orders & Invoices** - Generate and manage POs and invoices
6. **Reports & Analytics** - Real-time analytics and comprehensive reports

Each card includes:
- Icon from lucide-react
- Title
- One-line description
- Smooth hover effects with elevation and border glow

### 4. **How It Works Section** (4-Step Flow)
1. **Create RFQ** - Define your procurement needs
2. **Vendors Submit Quotes** - Receive competitive proposals
3. **Compare & Approve** - Select the best vendor
4. **Generate PO & Invoice** - Complete the transaction

- Horizontal flow with arrows between steps
- Circular numbered badges
- Hover effects on each step card
- Responsive: converts to vertical flow on mobile

### 5. **Roles Section** (4 Role Cards)
- **Admin** - Full system access, manage users & vendors, view analytics, configure workflows
- **Procurement Officer** - Create RFQs, compare quotations, generate POs, manage vendors
- **Manager** - Approve/reject requests, monitor workflows, view reports
- **Vendor** - Submit quotations, track RFQ status, view purchase orders

Each role card includes:
- Icon representing the role
- Title
- List of permissions with checkmarks
- Smooth hover effects

### 6. **CTA Section**
- Large centered section with headline: "Ready to Streamline Your Procurement?"
- Subheading describing the platform's benefits
- Two CTAs:
  - "Get Started" button → routes to `/#/signup`
  - "Sign In" button → routes to `/#/login`

### 7. **Footer**
- VendorBridge logo with icon
- Copyright text: "© 2026 VendorBridge. All rights reserved."
- Clean, minimal design

## Design System

### Color Palette
- **Background**: Deep navy blue gradient (#0a1929 → #0f2744 → #1a365d)
- **Primary Accent**: Emerald green (#10b981)
- **Secondary Accent**: Darker emerald (#059669)
- **Glass morphism**: Translucent cards with backdrop blur

### Typography
- **Hero Title**: 4rem (64px), bold weight 800
- **Section Titles**: 2.5rem (40px), bold weight 700
- **Body Text**: Clean, readable with proper line height
- **Colors**: White for headings, rgba(255,255,255,0.7-0.8) for body text

### Animations
- **Fade-in-up**: Smooth entrance animations for hero content
- **Float**: Animated gradient orbs in hero background
- **Hover effects**: Elevation, scale, and glow effects on cards
- **Scroll effects**: Navbar transforms on scroll

### Responsive Design
- **Desktop**: Full-width grid layouts, horizontal step flow
- **Tablet**: Adjusted grid columns, maintained spacing
- **Mobile**: 
  - Single column layouts
  - Vertical step flow
  - Smaller typography
  - Adjusted padding and spacing

## Tech Stack
- **React** 19.2.6
- **React Router DOM** 7.17.0 (HashRouter)
- **Tailwind CSS** 4.3.0
- **lucide-react** 1.17.0 (for icons)
- **Vite** 8.0.16 (build tool)

## Routing
All routes use HashRouter for GitHub Pages compatibility:
- `/` → Landing page
- `/#/login` → Login page
- `/#/signup` → Signup page
- `/#/dashboard` → Dashboard (protected)

## Key Files
- `src/pages/Landing.jsx` - Main landing page component
- `src/pages/Landing.css` - Landing page styles
- `src/App.jsx` - Router configuration

## Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Highlights
✅ No Lorem Ipsum text - all real, meaningful content
✅ Smooth scroll animations and transitions
✅ Mobile responsive design
✅ Dark theme with navy blue and emerald green gradients
✅ Professional, modern aesthetic
✅ All CTAs properly routed to signup/login pages
✅ Icons from lucide-react library
✅ Glass morphism design with backdrop blur effects
✅ Hover effects on all interactive elements
✅ Optimized for performance

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports backdrop-filter for glass morphism effects
- Responsive design works on all screen sizes

---

Built with ❤️ for VendorBridge
