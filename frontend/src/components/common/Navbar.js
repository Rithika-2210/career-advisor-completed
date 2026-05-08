/**
 * Navbar Component
 * Responsive navigation with auth state
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, LayoutDashboard, User, FileText,
  Lightbulb, Building2, Menu, X, LogOut, ChevronDown, Shield, BookMarked
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/assessment', label: 'Assessment', icon: FileText },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/colleges', label: 'Colleges', icon: Building2 },
  { to: '/admission-guidance', label: 'Admission', icon: BookMarked },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6, 13, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'inherit', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--teal-500), #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
            Career<span style={{ color: 'var(--teal-400)' }}>Advisor</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem', fontWeight: 500,
                color: isActive(to) ? 'var(--teal-400)' : 'var(--text-secondary)',
                background: isActive(to) ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { if (!isActive(to)) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (!isActive(to)) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
            {user.role === 'admin' && (
              <Link to="/admin" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem', fontWeight: 500,
                color: isActive('/admin') ? 'var(--amber-400)' : 'var(--text-secondary)',
              }}>
                <Shield size={15} />Admin
              </Link>
            )}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem',
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--teal-500), var(--purple-500))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', width: 180,
                  background: 'var(--surface-1)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 200,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.65rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem',
                  }}>
                    <User size={14} />Profile Settings
                  </Link>
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem',
                    background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                  }}>
                    <LogOut size={14} />Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile toggle */}
          {user && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none' }}
              id="mobile-menu-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '1rem',
          background: 'var(--navy-900)',
          display: 'flex', flexDirection: 'column', gap: '0.25rem'
        }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)',
              color: isActive(to) ? 'var(--teal-400)' : 'var(--text-secondary)',
              background: isActive(to) ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
              fontSize: '0.9rem',
            }}>
              <Icon size={16} />{label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)',
            color: '#f87171', fontSize: '0.9rem',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <LogOut size={16} />Sign Out
          </button>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}

      <style>{`@media (max-width: 768px) { #mobile-menu-btn { display: flex !important; } }`}</style>
    </nav>
  );
}
