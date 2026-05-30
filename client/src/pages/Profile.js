import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    profile: { bio: '', skills: '', education: '', experience: '', location: '', resumeText: '', linkedIn: '', github: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/api/profile').then((res) => {
      const u = res.data;
      setForm({
        name: u.name || '',
        profile: {
          bio: u.profile?.bio || '',
          skills: (u.profile?.skills || []).join(', '),
          education: u.profile?.education || '',
          experience: u.profile?.experience || '',
          location: u.profile?.location || '',
          resumeText: u.profile?.resumeText || '',
          linkedIn: u.profile?.linkedIn || '',
          github: u.profile?.github || '',
        },
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const payload = {
        name: form.name,
        profile: {
          ...form.profile,
          skills: form.profile.skills.split(',').map((s) => s.trim()).filter(Boolean),
        },
      };
      await api.put('/api/profile', payload);
      setMsg('Profile saved! ✓');
    } catch (err) {
      setMsg('Failed to save: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const setField = (key, val) => setForm((f) => ({ ...f, profile: { ...f.profile, [key]: val } }));

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Keep your profile updated to get better job matches</p>

      {msg && <div className={`alert ${msg.includes('✓') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <form onSubmit={handleSave}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Basic Info</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" value={user?.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-control" placeholder="City, Country" value={form.profile.location} onChange={(e) => setField('location', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea className="form-control" rows={3} placeholder="Tell employers about yourself..." value={form.profile.bio} onChange={(e) => setField('bio', e.target.value)} />
          </div>
        </div>

        {user?.role === 'student' && (
          <>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Academic & Experience</h3>
              <div className="form-group">
                <label>Education</label>
                <input className="form-control" placeholder="B.Tech Computer Science, IIT Delhi, 2024" value={form.profile.education} onChange={(e) => setField('education', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <textarea className="form-control" rows={3} placeholder="Internships, projects, part-time work..." value={form.profile.experience} onChange={(e) => setField('experience', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Skills <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>(comma-separated)</span></label>
                <input className="form-control" placeholder="React, Node.js, Python, SQL..." value={form.profile.skills} onChange={(e) => setField('skills', e.target.value)} />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Resume (for AI Analysis)</h3>
              <div className="form-group">
                <label>Paste your resume text</label>
                <textarea className="form-control" rows={8} placeholder="Paste your full resume here for AI-powered analysis and job matching..." value={form.profile.resumeText} onChange={(e) => setField('resumeText', e.target.value)} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                💡 The AI tools use this text to analyze your resume and match you with jobs.
              </p>
            </div>
          </>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Links</h3>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input className="form-control" placeholder="https://linkedin.com/in/yourname" value={form.profile.linkedIn} onChange={(e) => setField('linkedIn', e.target.value)} />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input className="form-control" placeholder="https://github.com/yourname" value={form.profile.github} onChange={(e) => setField('github', e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
