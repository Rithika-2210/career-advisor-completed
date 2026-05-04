import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Spinner, { EmptyState, PageHeader } from '../components/common/Spinner';
import { recommendationAPI } from '../api/services';
import toast from 'react-hot-toast';
import {
  Lightbulb, RefreshCw, CheckCircle, TrendingUp, BookOpen,
  Briefcase, ChevronRight, Award, Target, ArrowUpRight, Clock
} from 'lucide-react';

export default function RecommendationsPage() {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeStream, setActiveStream] = useState(0);
  const [activeCareer, setActiveCareer] = useState(0);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await recommendationAPI.getMy();
      setRec(data.recommendation);
    } catch {
      // no recommendations yet
    } finally {
      setLoading(false);
    }
  };

  const generateRecs = async () => {
    setGenerating(true);
    try {
      const { data } = await recommendationAPI.generate();
      setRec(data.recommendation);
      toast.success('Recommendations generated!');
    } catch {
      // interceptor handles
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
        <Spinner size={40} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <PageHeader
            title="Your Recommendations"
            subtitle="Personalized guidance based on your profile and assessment results."
            badge="AI-Ready Engine"
            action={
              <button className="btn btn-primary" onClick={generateRecs} disabled={generating}>
                <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
                {rec ? 'Regenerate' : 'Generate'} Recommendations
              </button>
            }
          />

          {!rec ? (
            <EmptyState
              icon={Lightbulb}
              title="No recommendations yet"
              description="Complete your profile with interests and take an assessment, then click 'Generate Recommendations' above."
              action={
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/profile" className="btn btn-secondary">Update Profile</Link>
                  <Link to="/assessment" className="btn btn-primary">Take Assessment</Link>
                </div>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>

              {/* Basis info */}
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(8, 145, 178, 0.02))', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Target size={18} color="var(--teal-400)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Recommendation Basis</h3>
                  <span className="badge badge-teal" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                    Engine: {rec.engineVersion}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Academic Score', value: rec.recommendationBasis?.academicScore ? `${rec.recommendationBasis.academicScore}%` : 'N/A' },
                    { label: 'Aptitude Score', value: rec.recommendationBasis?.aptitudeScore ? `${rec.recommendationBasis.aptitudeScore}%` : 'N/A' },
                    { label: 'Interest Alignment', value: `${rec.recommendationBasis?.interestAlignment || 0}%` },
                    { label: 'Top Interests', value: rec.recommendationBasis?.topInterests?.slice(0, 2).join(', ') || 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</p>
                      <p style={{ fontWeight: 600, color: 'var(--teal-300)', fontSize: '0.9rem' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stream Recommendations */}
              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="var(--teal-400)" /> Recommended Streams
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {rec.recommendedStreams?.map((s, i) => (
                    <div key={s.stream} className="card" onClick={() => setActiveStream(i)}
                      style={{
                        cursor: 'pointer',
                        border: `2px solid ${activeStream === i ? 'var(--teal-400)' : 'var(--border)'}`,
                        background: activeStream === i ? 'rgba(14, 165, 233, 0.05)' : 'var(--surface-1)',
                        transition: 'var(--transition)',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {s.rank === 1 && <Award size={16} color="var(--amber-400)" />}
                          <h3 style={{ fontSize: '1rem' }}>{s.stream}</h3>
                        </div>
                        <span className={`badge badge-${s.rank === 1 ? 'teal' : 'amber'}`} style={{ fontSize: '0.7rem' }}>
                          {s.confidence}% match
                        </span>
                      </div>

                      {/* Confidence bar */}
                      <div className="progress-bar" style={{ marginBottom: '0.75rem' }}>
                        <div className="progress-fill" style={{ width: `${s.confidence}%` }} />
                      </div>

                      {s.rank === 1 && (
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                          ⭐ Top Pick
                        </span>
                      )}

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.justification}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Degree Recommendations */}
              {rec.recommendedDegrees?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} color="var(--amber-400)" /> Suggested Degree Programs
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {rec.recommendedDegrees.map((d, i) => (
                      <div key={i} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '0.95rem', flex: 1 }}>{d.name}</h3>
                          <span className="badge badge-green" style={{ fontSize: '0.7rem', flexShrink: 0 }}>{d.duration}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.5 }}>{d.description}</p>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Eligibility: </span>{d.eligibility}
                        </p>
                        {d.topColleges?.length > 0 && (
                          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {d.topColleges.slice(0, 3).map(c => (
                              <span key={c} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--surface-3)', borderRadius: '99px', color: 'var(--text-muted)' }}>{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Career Paths */}
              {rec.careerPaths?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="var(--purple-500)" /> Career Path Mapping
                  </h2>

                  {/* Tab selectors */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {rec.careerPaths.map((cp, i) => (
                      <button key={i} onClick={() => setActiveCareer(i)} style={{
                        padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'var(--transition)',
                        background: activeCareer === i ? 'rgba(139, 92, 246, 0.15)' : 'var(--surface-2)',
                        color: activeCareer === i ? '#a78bfa' : 'var(--text-muted)',
                        border: `1px solid ${activeCareer === i ? 'rgba(139, 92, 246, 0.4)' : 'var(--border)'}`,
                      }}>
                        {cp.title}
                      </button>
                    ))}
                  </div>

                  {/* Active career detail */}
                  {rec.careerPaths[activeCareer] && (() => {
                    const cp = rec.careerPaths[activeCareer];
                    return (
                      <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{cp.title}</h3>
                          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{cp.averageSalary}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{cp.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          {/* Entry roles */}
                          <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-400)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Briefcase size={13} /> Entry Level Roles
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {cp.entryRoles?.map(r => (
                                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                  <ChevronRight size={12} color="var(--teal-400)" />{r}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Growth roles */}
                          <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber-400)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <TrendingUp size={13} /> Growth Opportunities
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {cp.growthRoles?.map(r => (
                                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                  <ArrowUpRight size={12} color="var(--amber-400)" />{r}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Related exams */}
                        {cp.relatedExams?.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Related Exams</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {cp.relatedExams.map(e => (
                                <span key={e} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{e}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {cp.skills?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Key Skills to Build</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {cp.skills.map(s => (
                                <span key={s} className="badge badge-teal" style={{ fontSize: '0.75rem' }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </section>
              )}

              {/* Footer links */}
              <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--surface-1)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Next Steps</p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Explore matching colleges and get admission guidance.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to="/colleges" className="btn btn-primary btn-sm">Explore Colleges</Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    Generated: {new Date(rec.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}