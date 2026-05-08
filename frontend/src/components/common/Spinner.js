/**
 * Common UI Components
 */

import React from 'react';

// ── Spinner ──────────────────────────────────────────────────
export default function Spinner({ size = 32, fullscreen = false }) {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(56, 189, 248, 0.15)`,
      borderTop: `3px solid var(--teal-400)`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );

  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--navy-900)',
        zIndex: 9999
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

// ── Loading Skeleton ─────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, borderRadius = 8 }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, var(--surface-1) 25%, var(--surface-2) 50%, var(--surface-1) 75%)',
      backgroundSize: '200% 100%',
      animation: 'gradientShift 1.5s ease infinite'
    }} />
  );
}

// ── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      {Icon && (
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Icon size={32} color="var(--teal-400)" />
        </div>
      )}
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{description}</p>}
      {action}
    </div>
  );
}

// ── Page Header ──────────────────────────────────────────────
export function PageHeader({ title, subtitle, action, badge }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {badge && (
        <span className={`badge badge-teal`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
          {badge}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'teal', change }) {
  const colors = {
    teal: { bg: 'rgba(14, 165, 233, 0.1)', color: 'var(--teal-400)' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber-400)' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--green-400)' },
    purple: { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' },
  };
  const c = colors[color] || colors.teal;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      {Icon && (
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={20} color={c.color} />
        </div>
      )}
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: c.color }}>{value}</p>
        {change && <p style={{ fontSize: '0.75rem', color: 'var(--green-400)', marginTop: '0.2rem' }}>{change}</p>}
      </div>
    </div>
  );
}

// ── Alert Banner ─────────────────────────────────────────────
export function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    info: { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgba(14, 165, 233, 0.3)', color: 'var(--teal-400)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: 'var(--amber-400)' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: 'var(--green-400)' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#f87171' },
  };
  const s = styles[type];

  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
    }}>
      <div>
        {title && <p style={{ fontWeight: 600, color: s.color, marginBottom: '0.2rem', fontSize: '0.9rem' }}>{title}</p>}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 0 0 1rem' }}>
          ×
        </button>
      )}
    </div>
  );
}
