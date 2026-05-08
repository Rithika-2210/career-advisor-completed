/**
 * NotFoundPage
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 20vw, 12rem)',
        fontWeight: 800, lineHeight: 1,
        background: 'linear-gradient(135deg, var(--teal-400), var(--teal-300))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>404</div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 360 }}>
        The page you're looking for doesn't exist. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <GraduationCap size={16} /> Go Home
        </Link>
        <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;