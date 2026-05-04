/**
 * CollegeDetailPage — with real enriched data (NIRF, placements, cutoffs, scholarships)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Spinner from '../components/common/Spinner';
import { collegeAPI } from '../api/services';
import {
  MapPin, Phone, Globe, Calendar, Award, BookOpen, ArrowLeft,
  CheckCircle, Building2, TrendingUp, Users, GraduationCap,
  ExternalLink, Star, DollarSign, Layers, Newspaper,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const TYPE_COLORS = { Government: 'green', 'Government-Aided': 'teal', Private: 'amber', Deemed: 'purple', Central: 'teal' };

function InfoRow({ label, value, color }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: color || 'var(--text-secondary)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function Section({ title, icon: Icon, color = 'teal', children }) {
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {Icon && <Icon size={17} color={`var(--${color}-400)`} />}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCutoff, setExpandedCutoff] = useState(null);

  useEffect(() => {
    collegeAPI.getOne(id)
      .then(r => setCollege(r.data.college))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Spinner size={40} /></div>
    </div>
  );

  if (!college) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2>College not found</h2>
        <Link to="/colleges" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Colleges
        </Link>
      </div>
    </div>
  );

  const tabs = ['overview', 'courses', 'cutoffs', 'scholarships', 'admission'];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <Link to="/colleges" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Back to Colleges
          </Link>

          {/* Hero Card */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 'var(--radius-md)', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--surface-3), var(--navy-600))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal-400)',
                border: '2px solid var(--border)',
              }}>
                {college.shortName?.charAt(0) || college.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  <span className={`badge badge-${TYPE_COLORS[college.type] || 'teal'}`}>{college.type}</span>
                  <span className="badge badge-purple">{college.category}</span>
                  {college.naacGrade && <span className="badge badge-amber">NAAC {college.naacGrade}</span>}
                  {college.nirfRank && <span className="badge badge-green">NIRF #{college.nirfRank}</span>}
                  {college.enriched && (
                    <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green-400)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.7rem' }}>
                      ✓ Live Data
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{college.name}</h1>
                {college.shortName && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{college.shortName}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <MapPin size={13} color="var(--teal-400)" />
                    {[college.location?.address, college.location?.city, college.location?.state].filter(Boolean).join(', ')}
                  </span>
                  {(college.established || college.founded) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <Calendar size={13} color="var(--amber-400)" />Est. {college.established || college.founded}
                    </span>
                  )}
                  {college.campusArea && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <Layers size={13} color="var(--purple-500)" />{college.campusArea}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {college.contact?.phone && (
                  <a href={`tel:${college.contact.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Phone size={13} />{college.contact.phone}
                  </a>
                )}
                {college.contact?.website && (
                  <a href={college.contact.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--teal-400)' }}>
                    <Globe size={13} />Official Website <ExternalLink size={11} />
                  </a>
                )}
                {(college.officialAdmissionUrl || college.admission?.website) && (
                  <a href={college.officialAdmissionUrl || college.admission?.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--amber-400)' }}>
                    <GraduationCap size={13} />Apply Now <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick stats */}
            {(college.placements || college.totalStudents) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                {college.placements?.average && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green-400)', fontSize: '1rem' }}>{college.placements.average}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Package</p>
                  </div>
                )}
                {college.placements?.highest && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--amber-400)', fontSize: '1rem' }}>{college.placements.highest}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Highest Package</p>
                  </div>
                )}
                {college.placements?.percentage && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal-400)', fontSize: '1rem' }}>{college.placements.percentage}%</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Placement Rate</p>
                  </div>
                )}
                {college.totalStudents && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#a78bfa', fontSize: '1rem' }}>{college.totalStudents?.toLocaleString()}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Students</p>
                  </div>
                )}
              </div>
            )}

            {college.recentNews && (
              <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.5rem' }}>
                <Newspaper size={14} color="var(--teal-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{college.recentNews}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--surface-1)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize', whiteSpace: 'nowrap',
                background: activeTab === tab ? 'var(--surface-3)' : 'transparent',
                color: activeTab === tab ? 'var(--teal-400)' : 'var(--text-muted)',
                border: `1px solid ${activeTab === tab ? 'var(--border-hover)' : 'transparent'}`,
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'var(--transition)',
              }}>{tab}</button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
              <Section title="Quick Facts" icon={Star} color="amber">
                <InfoRow label="NIRF Rank" value={college.nirfRank ? `#${college.nirfRank} (${college.nirfCategory || college.category})` : '—'} color="var(--teal-400)" />
                <InfoRow label="NIRF Score" value={college.nirfScore ? `${college.nirfScore}/100` : null} />
                <InfoRow label="NAAC Grade" value={college.naacGrade} color="var(--amber-400)" />
                <InfoRow label="Affiliation" value={college.affiliation} />
                <InfoRow label="Campus Area" value={college.campusArea} />
                <InfoRow label="Total Students" value={college.totalStudents?.toLocaleString()} />
                <InfoRow label="Faculty" value={college.facultyCount} />
              </Section>
              <Section title="Placement Stats" icon={TrendingUp} color="green">
                <InfoRow label="Avg Package" value={college.placements?.average} color="var(--green-400)" />
                <InfoRow label="Highest Package" value={college.placements?.highest} color="var(--amber-400)" />
                <InfoRow label="Placement %" value={college.placements?.percentage ? `${college.placements.percentage}%` : null} />
                <InfoRow label="Hostel Fees" value={college.hostelFees} />
                <InfoRow label="Nearest Railway" value={college.nearestRailway} />
                {college.nirfUrl && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <a href={college.nirfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      View on NIRF India <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </Section>
              {college.notableAlumni?.length > 0 && (
                <Section title="Notable Alumni" icon={Users} color="purple">
                  {college.notableAlumni.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0.3rem 0' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-400)', flexShrink: 0 }} />
                      {a}
                    </div>
                  ))}
                </Section>
              )}
              <Section title="Facilities" icon={Building2} color="teal">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                  {college.facilities?.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={13} color="var(--green-400)" />{f}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* Courses */}
          {activeTab === 'courses' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <BookOpen size={16} color="var(--teal-400)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Courses Offered ({college.courses?.length || 0})</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {college.courses?.map((c, i) => (
                  <div key={i} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{c.name}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{c.degree}</span>
                          {c.duration && <span className="badge" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '0.7rem' }}>{c.duration}</span>}
                          {c.seats && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{c.seats} seats</span>}
                        </div>
                      </div>
                      {c.fees && (
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--green-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <DollarSign size={13} />{c.fees}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>per year</p>
                        </div>
                      )}
                    </div>
                    {c.eligibility && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.6rem', display: 'flex', gap: '0.4rem' }}>
                        <AlertCircle size={13} color="var(--amber-400)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span><strong>Eligibility:</strong> {c.eligibility}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cutoffs */}
          {activeTab === 'cutoffs' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {college.realCutoffs ? (
                <>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                    <AlertCircle size={15} color="var(--teal-400)" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Cutoffs are indicative from recent cycles. Verify from official sources.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(college.realCutoffs).map(([courseName, catData]) => (
                      <div key={courseName} className="card" style={{ padding: '1.1rem' }}>
                        <button onClick={() => setExpandedCutoff(expandedCutoff === courseName ? null : courseName)}
                          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'left' }}>{courseName}</h4>
                          {expandedCutoff === courseName ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                        </button>
                        {expandedCutoff === courseName && (
                          <div style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.entries(catData).map(([category, cutoff]) => (
                              <div key={category} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{category}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--teal-300)', fontWeight: 500 }}>{cutoff}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ marginBottom: '0.75rem' }} />
                  <p>Cutoff data not yet available. Check the official admission portal.</p>
                </div>
              )}
            </div>
          )}

          {/* Scholarships */}
          {activeTab === 'scholarships' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {college.scholarships?.length > 0 ? college.scholarships.map((s, i) => (
                <div key={i} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.9rem' }}>{s.name}</h4>
                    <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{s.amount}</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Eligibility:</strong> {s.eligibility}
                  </p>
                </div>
              )) : null}
              <div className="card" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  💡 Also check <strong>NSP (National Scholarship Portal)</strong>, PM-YASASVI, and AICTE scholarships at{' '}
                  <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-400)' }}>scholarships.gov.in</a>
                </p>
              </div>
            </div>
          )}

          {/* Admission */}
          {activeTab === 'admission' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Admission Process</h3>
                {college.admission?.process && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{college.admission.process}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {college.admission?.entranceExams?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Entrance Exams</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {college.admission.entranceExams.map(e => <span key={e} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{e}</span>)}
                      </div>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Application Window</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {college.admission?.applicationStart || 'Check portal'}{college.admission?.applicationEnd ? ` – ${college.admission.applicationEnd}` : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  {(college.officialAdmissionUrl || college.admission?.website) && (
                    <a href={college.officialAdmissionUrl || college.admission.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      Admission Portal <ExternalLink size={13} />
                    </a>
                  )}
                  {college.tneaUrl && (
                    <a href={college.tneaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      TNEA Online <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>📋 Document Checklist</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                  {['10th Mark Sheet & Certificate','12th Mark Sheet & Certificate','Transfer Certificate (TC)','Conduct Certificate','Community/Caste Certificate','Income Certificate (scholarships)','Aadhar Card / ID Proof','4 Passport Size Photographs','Migration Certificate (CBSE/ICSE)','Entrance Exam Scorecard','Medical Fitness Certificate','Anti-Ragging Affidavit'].map(doc => (
                    <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderRadius: 3, flexShrink: 0 }} />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}