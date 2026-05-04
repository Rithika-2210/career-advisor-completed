/**
 * DashboardPage
 * Main student dashboard with profile summary, stats, notifications
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { StatCard, Alert } from '../components/common/Spinner';
import { useAuth } from '../context/AuthContext';
import { assessmentAPI, recommendationAPI } from '../api/services';
import {
  User, FileText, Lightbulb, Building2, Bell, ChevronRight,
  Target, TrendingUp, Award, CheckCircle, Clock, ArrowRight, BookMarked
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [ar] = await Promise.allSettled([
          assessmentAPI.getMyResults(),
          recommendationAPI.getMy().then(r => setRecommendation(r.data.recommendation)).catch(() => {}),
        ]);
        if (ar.status === 'fulfilled') setAssessmentResults(ar.value.data.results || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    setUnreadNotifs(user?.notifications?.filter(n => !n.read).length || 0);
  }, [user]);

  const profilePercent = (() => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.academicDetails?.currentEducation) score += 20;
    if (user?.interests?.length > 0) score += 20;
    if (user?.location?.state) score += 20;
    if (user?.academicDetails?.tenthMarks) score += 20;
    return score;
  })();

  const latestResult = assessmentResults[0];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">

          {/* Welcome Header */}
          <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem' }}>
                  Good to see you, <span style={{ color: 'var(--teal-400)' }}>{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Here's your career guidance overview.</p>
              </div>
              {unreadNotifs > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)' }}>
                  <Bell size={16} color="var(--amber-400)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--amber-400)' }}>{unreadNotifs} new notification{unreadNotifs > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile incomplete alert */}
          {profilePercent < 80 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Alert
                type="info"
                title="Complete your profile for better recommendations"
                message={`Your profile is ${profilePercent}% complete. Add your academic details, interests, and location.`}
                action={<Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--teal-400)' }}>Complete Profile →</Link>}
              />
            </div>
          )}

          {/* Stats Row */}
          <div className="grid-4" style={{ marginBottom: '2rem', animation: 'fadeIn 0.5s ease 0.1s both' }}>
            <StatCard label="Profile Completion" value={`${profilePercent}%`} icon={User} color="teal" />
            <StatCard label="Assessments Taken" value={assessmentResults.length} icon={FileText} color="amber" />
            <StatCard label="Best Score" value={latestResult ? `${latestResult.percentage}%` : '—'} icon={Award} color="green" />
            <StatCard label="Recommendations" value={recommendation ? '✓ Ready' : 'Pending'} icon={Lightbulb} color="purple" />
          </div>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.5s ease 0.2s both' }}>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { to: '/profile', icon: User, label: 'Update Profile', desc: 'Add academic & personal details', color: 'teal' },
                  { to: '/assessment', icon: FileText, label: 'Take Assessment', desc: '30-question aptitude test', color: 'amber' },
                  { to: '/recommendations', icon: Lightbulb, label: 'View Recommendations', desc: 'See career & stream suggestions', color: 'green' },
                  { to: '/colleges', icon: Building2, label: 'Explore Colleges', desc: 'Find matching institutions', color: 'purple' },
                  { to: '/admission-guidance', icon: BookMarked, label: 'Admission Guidance', desc: 'Step-by-step process & documents', color: 'amber' },
                ].map(({ to, icon: Icon, label, desc, color }) => (
                  <Link key={to} to={to} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    transition: 'var(--transition)', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--surface-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: `rgba(${color === 'teal' ? '14,165,233' : color === 'amber' ? '245,158,11' : color === 'green' ? '16,185,129' : '139,92,246'}, 0.12)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color={`var(--${color}-400)`} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{label}</p>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Card */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--teal-500), var(--purple-500))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 700, color: 'white',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{user?.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    {user?.role === 'admin' && <span className="badge badge-amber" style={{ marginTop: '0.25rem' }}>Admin</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profile Completion</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)', fontWeight: 600 }}>{profilePercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${profilePercent}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Education', value: user?.academicDetails?.currentEducation || 'Not set' },
                    { label: 'Location', value: user?.location?.state ? `${user.location.city || ''}, ${user.location.state}` : 'Not set' },
                    { label: 'Interests', value: user?.interests?.length ? `${user.interests.length} added` : 'None added' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ color: value === 'Not set' || value === 'None added' ? 'var(--text-muted)' : 'var(--text-secondary)', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>

                <Link to="/profile" className="btn btn-secondary w-full" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                  Edit Profile
                </Link>
              </div>

              {/* Latest Assessment */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Latest Assessment</h3>
                {latestResult ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: `3px solid ${latestResult.percentage >= 60 ? 'var(--green-400)' : 'var(--amber-400)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
                        color: latestResult.percentage >= 60 ? 'var(--green-400)' : 'var(--amber-400)'
                      }}>
                        {latestResult.percentage}%
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {latestResult.percentage >= 80 ? 'Excellent' : latestResult.percentage >= 60 ? 'Good' : 'Average'}
                        </p>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {latestResult.totalScore}/{latestResult.maxScore} correct
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <Clock size={11} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {new Date(latestResult.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {latestResult.categoryScores?.map(cs => (
                      <div key={cs.category} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{cs.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cs.percentage}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${cs.percentage}%`, height: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <Target size={32} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No assessment taken yet</p>
                    <Link to="/assessment" className="btn btn-primary btn-sm">Take Assessment</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendation preview */}
          {recommendation && (
            <div className="card" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease 0.3s both', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(8, 145, 178, 0.02))', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={18} color="var(--teal-400)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Your Top Recommendation</h3>
                </div>
                <Link to="/recommendations" className="btn btn-ghost btn-sm" style={{ color: 'var(--teal-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {recommendation.recommendedStreams?.slice(0, 3).map(s => (
                  <div key={s.stream} style={{
                    padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)',
                    background: s.rank === 1 ? 'rgba(14, 165, 233, 0.15)' : 'var(--surface-2)',
                    border: `1px solid ${s.rank === 1 ? 'rgba(14, 165, 233, 0.4)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    {s.rank === 1 && <CheckCircle size={14} color="var(--teal-400)" />}
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: s.rank === 1 ? 'var(--teal-300)' : 'var(--text-secondary)' }}>{s.stream}</span>
                    <span className={`badge badge-${s.rank === 1 ? 'teal' : 'amber'}`} style={{ fontSize: '0.7rem' }}>{s.confidence}% match</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {user?.notifications?.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease 0.4s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Bell size={16} color="var(--amber-400)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Notifications</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {user.notifications.slice(0, 3).map((n, i) => (
                  <div key={i} style={{
                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                    background: n.read ? 'transparent' : 'rgba(245, 158, 11, 0.05)',
                    border: `1px solid ${n.read ? 'var(--border)' : 'rgba(245, 158, 11, 0.2)'}`,
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.read ? 'var(--text-muted)' : 'var(--amber-400)', marginTop: '0.4rem', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
