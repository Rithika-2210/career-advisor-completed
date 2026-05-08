/**
 * AdminPage - Analytics dashboard for admins
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Spinner, { StatCard, PageHeader } from '../components/common/Spinner';
import { userAPI } from '../api/services';
import { Users, UserCheck, TrendingUp, BarChart2, MapPin } from 'lucide-react';

export function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      userAPI.getStats().then(r => setStats(r.data.stats)),
      userAPI.getAllUsers().then(r => setUsers(r.data.users || []))
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size={40} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management." badge="Admin Only" />

          {/* Stats */}
          {stats && (
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <StatCard label="Total Students" value={stats.totalUsers} icon={Users} color="teal" />
              <StatCard label="Active Users" value={stats.activeUsers} icon={UserCheck} color="green" />
              <StatCard label="Profiles Completed" value={stats.profileCompleted} icon={BarChart2} color="amber" />
              <StatCard label="New This Month" value={stats.newUsers} icon={TrendingUp} color="purple" change="Last 30 days" />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Users by state */}
            {stats?.byState?.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <MapPin size={16} color="var(--teal-400)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Users by State</h3>
                </div>
                {stats.byState.map(({ _id, count }) => _id && (
                  <div key={_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{_id}</span>
                    <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent users */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Users size={16} color="var(--teal-400)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Recent Registrations</h3>
              </div>
              {users.slice(0, 8).map(u => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--teal-500), var(--purple-500))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0
                  }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;