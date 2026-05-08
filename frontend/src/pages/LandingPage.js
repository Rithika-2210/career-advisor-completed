/**
 * Landing Page
 * Hero, features, and CTA sections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import {
  GraduationCap, Target, BookOpen, Building2, TrendingUp,
  Users, Award, ArrowRight, CheckCircle, Zap, Brain, Map
} from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'Aptitude Assessment', desc: 'MCQ-based tests covering logical, analytical, verbal & quantitative skills.', color: 'teal' },
  { icon: Target, title: 'Smart Recommendations', desc: 'Rule-based engine maps your profile to ideal streams, degrees & careers.', color: 'amber' },
  { icon: Map, title: 'Career Path Mapping', desc: 'See entry roles, growth paths, salary ranges & exams for each career.', color: 'green' },
  { icon: Building2, title: 'College Discovery', desc: 'Explore government & private colleges filtered by location, course & eligibility.', color: 'purple' },
  { icon: BookOpen, title: 'Admission Guidance', desc: 'Step-by-step process, document checklists, exam calendar & official links per stream.', color: 'teal' },
  { icon: TrendingUp, title: 'Progress Dashboard', desc: 'Track your assessment scores, recommendations & profile completion.', color: 'amber' },
];

const STATS = [
  { value: '500+', label: 'Colleges Listed' },
  { value: '50+', label: 'Career Paths' },
  { value: '30', label: 'Assessment Questions' },
  { value: '100%', label: 'Free to Use' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '6rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14, 165, 233, 0.1), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.04)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '10%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.05)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="animate-fade-in">
            <span className="badge badge-teal" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Zap size={12} style={{ marginRight: 4 }} /> AI-Ready Career Guidance Platform
            </span>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              marginBottom: '1.5rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}>
              Discover Your Perfect{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--teal-400), var(--teal-300))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Career Path
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem', color: 'var(--text-secondary)',
              maxWidth: 560, margin: '0 auto 2.5rem',
              lineHeight: 1.7
            }}>
              Personalized academic and career guidance powered by aptitude assessments,
              interest mapping, and intelligent recommendations tailored just for you.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start for Free <ArrowRight size={18} />
              </Link>
              <Link to="/colleges" className="btn btn-secondary btn-lg">
                Explore Colleges
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['No Credit Card Required', 'Student-Focused', 'Expert-Curated Data'].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle size={14} color="var(--green-400)" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ padding: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--teal-400)', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-amber" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Features</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Everything You Need to Decide</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
              From self-assessment to college discovery, we have the tools to guide your education journey.
            </p>
          </div>

          <div className="grid-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ cursor: 'default' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                  background: `rgba(${color === 'teal' ? '14,165,233' : color === 'amber' ? '245,158,11' : color === 'green' ? '16,185,129' : '139,92,246'}, 0.12)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={`var(--${color}-400)`} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'rgba(14, 165, 233, 0.03)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>4 simple steps to your personalized career roadmap</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
            {[
              { step: '01', title: 'Create Profile', desc: 'Enter your academic details, interests, and goals.', icon: Users },
              { step: '02', title: 'Take Assessment', desc: '30-question aptitude and interest test.', icon: Brain },
              { step: '03', title: 'Get Recommendations', desc: 'Receive personalized stream and career suggestions.', icon: Target },
              { step: '04', title: 'Explore & Apply', desc: 'Discover matching colleges and get admission guidance.', icon: Building2 },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, var(--teal-500), #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                }}>
                  <Icon size={22} color="white" />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--teal-400)', fontWeight: 700, letterSpacing: '0.1em' }}>{step}</span>
                <h3 style={{ fontSize: '1rem', margin: '0.4rem 0' }}>{title}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            padding: '3.5rem',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(8, 145, 178, 0.05))',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <Award size={40} color="var(--amber-400)" style={{ marginBottom: '1.25rem' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Ready to Find Your Path?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
              Join thousands of students who've found their direction with Career Advisor.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--teal-500), #0284c7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
              Career<span style={{ color: 'var(--teal-400)' }}>Advisor</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Personalized guidance for every student's unique journey. Built with ❤️ for India.
          </p>
        </div>
      </footer>

      <style>{`@media (max-width: 768px) { section div[style*="gridTemplateColumns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}