import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    description: '', salary: '', experience: 'Fresher',
    skills: '', requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user?.role !== 'employer') {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚫</div>
        <h2>Employer Access Only</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>You need an employer account to post jobs.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        requirements: form.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      };
      const res = await axios.post('/api/jobs', payload);
      navigate(`/jobs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 className="page-title">Post a Job</h1>
      <p className="page-subtitle">Reach thousands of qualified students and fresh graduates</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Job Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input className="form-control" placeholder="Frontend Developer" value={form.title} onChange={(e) => f('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input className="form-control" placeholder="Your Company" value={form.company} onChange={(e) => f('company', e.target.value)} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Location *</label>
              <input className="form-control" placeholder="Bengaluru / Remote" value={form.location} onChange={(e) => f('location', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select className="form-control" value={form.type} onChange={(e) => f('type', e.target.value)}>
                {['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Salary / Stipend</label>
              <input className="form-control" placeholder="₹8-12 LPA / ₹20k/month" value={form.salary} onChange={(e) => f('salary', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Experience Required</label>
              <select className="form-control" value={form.experience} onChange={(e) => f('experience', e.target.value)}>
                {['Fresher', '0-1 years', '1-2 years', '2-3 years', '3+ years'].map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Job Description</h3>
          <div className="form-group">
            <label>Description *</label>
            <textarea className="form-control" rows={6} placeholder="Describe the role, team, and what the candidate will work on..." value={form.description} onChange={(e) => f('description', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Requirements <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>(one per line)</span></label>
            <textarea className="form-control" rows={4} placeholder="Bachelor's degree in CS or related field&#10;Strong problem-solving skills&#10;Experience with React" value={form.requirements} onChange={(e) => f('requirements', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Skills <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>(comma-separated)</span></label>
            <input className="form-control" placeholder="React, Node.js, MongoDB, REST APIs" value={form.skills} onChange={(e) => f('skills', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : '🚀 Post Job'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
