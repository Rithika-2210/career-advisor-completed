/**
 * CollegesPage
 * College discovery with filters and search
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Spinner, { EmptyState } from '../components/common/Spinner';
import { collegeAPI } from '../api/services';
import { Search, Building2, MapPin, Filter, ChevronRight, X, RefreshCw } from 'lucide-react';

const TYPE_COLORS = {
  Government: 'green', 'Government-Aided': 'teal', Private: 'amber', Deemed: 'purple', Central: 'teal'
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [filters, setFilters] = useState({ search: '', state: '', category: '', type: '' });
  const [filterOptions, setFilterOptions] = useState({ states: [], categories: [], types: [] });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Load filter options once
  useEffect(() => {
    collegeAPI.getFilters().then(r => setFilterOptions(r.data.filters)).catch(() => {});
  }, []);

  const fetchColleges = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 9 };
      const { data } = await collegeAPI.getAll(params);
      setColleges(data.colleges);
      setPagination(data.pagination);
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(() => fetchColleges(1), 400);
    return () => clearTimeout(t);
  }, [fetchColleges]);

  const clearFilters = () => setFilters({ search: '', state: '', category: '', type: '' });
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Explore Colleges</h1>
            <p style={{ color: 'var(--text-muted)' }}>Discover government and aided colleges matching your stream and location.</p>
          </div>

          {/* Search and Filter bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: 220 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input" style={{ paddingLeft: '2.5rem' }}
                placeholder="Search colleges..."
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              />
            </div>

            {/* Desktop filters */}
            <div className="hide-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="form-select" style={{ width: 160 }} value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))}>
                <option value="">All States</option>
                {filterOptions.states.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className="form-select" style={{ width: 160 }} value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}>
                <option value="">All Categories</option>
                {filterOptions.categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="form-select" style={{ width: 150 }} value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                <option value="">All Types</option>
                {filterOptions.types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Mobile filter toggle */}
            <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)} style={{ position: 'relative' }}>
              <Filter size={15} />Filters
              {activeFilterCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: 'var(--teal-500)', color: 'white', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: 'var(--text-muted)' }}>
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="card" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))}>
                  <option value="">All States</option>
                  {filterOptions.states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}>
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                  <option value="">All Types</option>
                  {filterOptions.types.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Results count */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {loading ? 'Loading...' : `${pagination.total} college${pagination.total !== 1 ? 's' : ''} found`}
          </p>

          {/* College Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <Spinner size={40} />
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No colleges found"
              description="Try adjusting your search or filters."
              action={<button className="btn btn-secondary" onClick={clearFilters}><RefreshCw size={14} /> Clear Filters</button>}
            />
          ) : (
            <div className="grid-3">
              {colleges.map(college => (
                <Link key={college._id} to={`/colleges/${college._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    {/* College header */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--surface-3), var(--navy-600))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 700, color: 'var(--teal-400)',
                        border: '1px solid var(--border)',
                      }}>
                        {college.shortName?.charAt(0) || college.name.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.2rem',
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' }}>
                          {college.name}
                        </h3>
                        {college.shortName && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{college.shortName}</p>}
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span className={`badge badge-${TYPE_COLORS[college.type] || 'teal'}`} style={{ fontSize: '0.7rem' }}>{college.type}</span>
                      <span className="badge" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '0.7rem' }}>
                        {college.category}
                      </span>
                    </div>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      <MapPin size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {college.location.city}, {college.location.state}
                      </span>
                    </div>

                    {/* Courses preview */}
                    {college.courses?.length > 0 && (
                      <div style={{ marginBottom: '0.75rem', flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          {college.courses.length} course{college.courses.length > 1 ? 's' : ''} offered
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {college.courses.slice(0, 2).map(c => (
                            <span key={c._id} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--surface-3)', borderRadius: '99px', color: 'var(--text-secondary)' }}>
                              {c.degree}
                            </span>
                          ))}
                          {college.courses.length > 2 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{college.courses.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accreditation */}
                    {college.accreditation?.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        {college.accreditation.slice(0, 1).map(a => (
                          <span key={a} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>★ {a}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)', fontWeight: 500 }}>View Details</span>
                      <ChevronRight size={14} color="var(--teal-400)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => fetchColleges(p)} style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: pagination.page === p ? 'var(--teal-500)' : 'var(--surface-2)',
                  color: pagination.page === p ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${pagination.page === p ? 'var(--teal-400)' : 'var(--border)'}`,
                  cursor: 'pointer', fontWeight: pagination.page === p ? 700 : 400, fontSize: '0.875rem',
                }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}