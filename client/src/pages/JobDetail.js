import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        if (user) {
          setApplied(res.data.applicants?.some((a) => a.user === user.id || a.user?._id === user.id));
        }
      })
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      setApplied(true);
      setMsg('Application submitted! 🎉');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.post(`/api/jobs/${id}/save`);
      setSaved(res.data.saved);
      setMsg(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!job) return null;

  const posted = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <Link to="/jobs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
        ← Back to Jobs
      </Link>

      {msg && (
        <div className={`alert ${msg.includes('🎉') || msg.includes('saved') ? 'alert-success' : 'alert-error'}`}>
          {msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>{job.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: 16 }}>🏢 {job.company}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-purple">{job.type}</span>
              <span className="badge badge-gray">📍 {job.location}</span>
              {job.salary && job.salary !== 'Not disclosed' && (
                <span className="badge badge-green">💰 {job.salary}</span>
              )}
              {job.experience && (
                <span className="badge badge-yellow">⚡ {job.experience}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
            {user?.role !== 'employer' && (
              <button
                className="btn btn-primary"
                onClick={handleApply}
                disabled={applied || applying}
              >
                {applied ? '✓ Applied' : applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
            <button className="btn btn-outline btn-sm" onClick={handleSave}>
              {saved ? '★ Saved' : '☆ Save Job'}
            </button>
            {user && (
              <Link to={`/ai-tools?job=${id}&title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} className="btn btn-ghost btn-sm">
                ✨ AI Match
              </Link>
            )}
          </div>
        </div>

        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: 16 }}>Posted {posted}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Job Description</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Requirements</h2>
          <ul style={{ paddingLeft: 20, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {job.skills?.length > 0 && (
        <div className="card">
          <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Skills Required</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {job.skills.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
