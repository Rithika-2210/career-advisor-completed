/**
 * AssessmentPage
 * MCQ aptitude test with timer, progress, and results
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { assessmentAPI } from '../api/services';
import toast from 'react-hot-toast';
import { Clock, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Trophy, BarChart2, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  logical: 'teal', analytical: 'amber', verbal: 'green', quantitative: 'purple', interest: 'amber'
};

export default function AssessmentPage() {
  const [phase, setPhase] = useState('intro'); // intro | test | result
  const [assessmentId, setAssessmentId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'test') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line
  }, [phase]);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const { data } = await assessmentAPI.start();
      setAssessmentId(data.assessmentId);
      setQuestions(data.questions);
      setTimeLeft(data.timeLimit * 60);
      setPreviousAttempt(data.previousAttempt);
      setPhase('test');
    } catch {
      // interceptor handles
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!assessmentId) return;
    setLoading(true);
    try {
      const answersArr = questions.map(q => ({
        questionId: q._id,
        selectedOption: answers[q._id] || null
      }));
      const { data } = await assessmentAPI.submit(assessmentId, answersArr);
      setResult(data.result);
      setPhase('result');
      toast.success('Assessment submitted!');
    } catch {
      // interceptor handles
    } finally {
      setLoading(false);
    }
  }, [assessmentId, answers, questions]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;
  const q = questions[current];

  // ── INTRO SCREEN ──────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '3rem 0' }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, var(--teal-500), #0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)',
              }}>
                <Trophy size={36} color="white" />
              </div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Career Aptitude Assessment</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                30 questions across 5 categories — logical, analytical, verbal, quantitative, and interest. Takes about 20–30 minutes.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Questions', value: '30', icon: '📝' },
                  { label: 'Time Limit', value: '30 min', icon: '⏱️' },
                  { label: 'Categories', value: '5', icon: '📊' },
                  { label: 'Difficulty', value: 'Mixed', icon: '🎯' },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--teal-400)' }}>{value}</p>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {previousAttempt && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--amber-400)' }}>
                    Previous attempt: <strong>{previousAttempt.score}%</strong> on {new Date(previousAttempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '2rem', padding: '1.25rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                {['Ensure a distraction-free environment', 'Answer all questions for best results', 'Timer starts when you begin', 'Results generate immediately after submission'].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} color="var(--green-400)" />{t}
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-lg w-full" onClick={startAssessment} disabled={loading}>
                {loading ? 'Loading questions...' : 'Start Assessment →'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── TEST SCREEN ───────────────────────────────────────────────
  if (phase === 'test' && q) {
    const catColor = CATEGORY_COLORS[q.category] || 'teal';

    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '2rem 0' }}>
          <div className="container" style={{ maxWidth: 720 }}>

            {/* Header bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question {current + 1} of {questions.length}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--teal-400)', fontWeight: 600 }}>{answeredCount}</span> answered
                </p>
              </div>

              {/* Timer */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-2)',
                border: `1px solid ${timeLeft < 300 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
              }}>
                <Clock size={16} color={timeLeft < 300 ? '#f87171' : 'var(--teal-400)'} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: timeLeft < 300 ? '#f87171' : 'var(--text-primary)', fontSize: '1rem' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Question card */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                <span className={`badge badge-${catColor}`} style={{ textTransform: 'capitalize' }}>{q.category}</span>
                <span className="badge" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{q.difficulty}</span>
              </div>
              <h2 style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                {q.questionText}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map(opt => {
                  const selected = answers[q._id] === opt.label;
                  return (
                    <button key={opt.label} onClick={() => setAnswers(prev => ({ ...prev, [q._id]: opt.label }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-md)', textAlign: 'left',
                        background: selected ? 'rgba(14, 165, 233, 0.12)' : 'var(--surface-2)',
                        border: `2px solid ${selected ? 'var(--teal-400)' : 'var(--border)'}`,
                        cursor: 'pointer', transition: 'var(--transition)', width: '100%',
                      }}
                      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: selected ? 'var(--teal-500)' : 'var(--surface-3)',
                        color: selected ? 'white' : 'var(--text-muted)',
                        fontWeight: 700, fontSize: '0.85rem',
                      }}>
                        {selected ? <CheckCircle size={16} /> : opt.label}
                      </div>
                      <span style={{ color: selected ? 'var(--teal-300)' : 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
                <ChevronLeft size={16} /> Previous
              </button>

              {/* Question dots (show 7 around current) */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {questions.slice(Math.max(0, current - 3), Math.min(questions.length, current + 4)).map((qq, i) => {
                  const idx = Math.max(0, current - 3) + i;
                  const answered = !!answers[qq._id];
                  const isCurrent = idx === current;
                  return (
                    <button key={idx} onClick={() => setCurrent(idx)} style={{
                      width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                      background: isCurrent ? 'var(--teal-500)' : answered ? 'var(--surface-3)' : 'var(--surface-2)',
                      color: isCurrent ? 'white' : answered ? 'var(--teal-400)' : 'var(--text-muted)',
                      outline: isCurrent ? '2px solid var(--teal-300)' : 'none', outlineOffset: 2,
                    }}>{idx + 1}</button>
                  );
                })}
              </div>

              {current < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-amber" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Test'}
                </button>
              )}
            </div>

            {/* Unanswered warning */}
            {answeredCount < questions.length && current === questions.length - 1 && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={16} color="var(--amber-400)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's' : ''} unanswered. You can still submit.
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── RESULT SCREEN ─────────────────────────────────────────────
  if (phase === 'result' && result) {
    const level = result.percentage >= 80 ? 'Excellent' : result.percentage >= 60 ? 'Good' : result.percentage >= 40 ? 'Average' : 'Needs Improvement';
    const levelColor = result.percentage >= 80 ? 'var(--green-400)' : result.percentage >= 60 ? 'var(--teal-400)' : result.percentage >= 40 ? 'var(--amber-400)' : '#f87171';

    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '3rem 0' }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              {/* Score circle */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 1.5rem',
                border: `6px solid ${levelColor}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 30px ${levelColor}40`,
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: levelColor, lineHeight: 1 }}>{result.percentage}%</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.35rem' }}>{level}!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                You scored {result.totalScore} out of {result.maxScore} in {result.timeTakenMinutes} min
              </p>

              {/* Category breakdown */}
              <div style={{ textAlign: 'left', margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category Breakdown</h3>
                {result.categoryScores?.map(cs => (
                  <div key={cs.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{cs.category}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: `var(--${CATEGORY_COLORS[cs.category] || 'teal'}-400)` }}>
                        {cs.score}/{cs.total} ({cs.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${cs.percentage}%`, background: `linear-gradient(90deg, var(--${CATEGORY_COLORS[cs.category] || 'teal'}-500), var(--${CATEGORY_COLORS[cs.category] || 'teal'}-300))` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/recommendations" className="btn btn-primary" style={{ flex: 1 }}>
                  Get Recommendations <ArrowRight size={16} />
                </Link>
                <Link to="/dashboard" className="btn btn-secondary" style={{ flex: 1 }}>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <div style={{ minHeight: '100vh' }}><Navbar /></div>;
}