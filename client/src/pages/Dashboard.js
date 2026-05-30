import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color || 'var(--accent-light)' }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function StudentDashboard({ profile }) {
  const apps = profile?.applications || [];
  const saved = profile?.savedJobs || [];

  const statusColor = { pending: 'badge-yellow', reviewed: 'badge-purple', accepted: 'badge-green', rejected: 'badge-red' };

  return (
    <>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <StatCard icon="📨" label="Applications Sent" value={apps.length} />
        <StatCard icon="★" label="Saved Jobs" value={saved.length} color="var(--yellow)" />
        <StatCard icon="✅" label="Accepted" value={apps.filter(a => a.status === 'accepted').length} color="var(--green)" />
      </div>

      <h2 className="section-title">Recent Applications</h2>
      {apps.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📋</div>
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {apps.slice(0, 5).map((app, i) => (
            <div key={i} className="card" style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{app.job?.title || 'Job Removed'}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{app.job?.company} • {app.job?.location}</div>
              </div>
              <span className={`badge ${statusColor[app.status] || 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <>
          <h2 className="section-title">Saved Jobs</h2>
          <div className="grid-3">
            {saved.slice(0, 3).map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="job-card">
                <div className="job-card-title">{job.title}</div>
                <div className="job-card-company">🏢 {job.company}</div>
                <span className="badge badge-gray">📍 {job.location}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/jobs/employer/mine')
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await api.delete(`/api/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  };

  if (loading) return <div className="loading-inline"><div className="spinner" /></div>;

  return (
    <>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <StatCard icon="💼" label="Jobs Posted" value={jobs.length} />
        <StatCard icon="👥" label="Total Applicants" value={jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0)} color="var(--yellow)" />
        <StatCard icon="✅" label="Active Jobs" value={jobs.filter(j => j.isActive).length} color="var(--green)" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Your Job Listings</h2>
        <Link to="/post-job" className="btn btn-primary btn-sm">+ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">💼</div>
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>Post Your First Job</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((job) => (
            <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{job.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {job.type} • {job.location} • {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/jobs/${job._id}`} className="btn btn-ghost btn-sm">View</Link>
                <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/api/profile')
        .then((res) => setProfile(res.data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">
          {user?.role === 'employer' ? 'Manage your job listings and find great talent.' : 'Track your applications and discover new opportunities.'}
        </p>
      </div>

      {user?.role === 'employer' ? (
        <EmployerDashboard />
      ) : (
        <StudentDashboard profile={profile} />
      )}

      {user?.role === 'student' && (
        <div className="card" style={{ marginTop: 32, background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(167,139,250,0.05))', borderColor: 'rgba(108,99,255,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ marginBottom: 6 }}>✨ Try AI Tools</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get your resume reviewed, generate cover letters, and prep for interviews.</p>
            </div>
            <Link to="/ai-tools" className="btn btn-primary">Open AI Tools →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
