import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AISection({ title, icon, children }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function AITools() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('resume');
  const [profile, setProfile] = useState(null);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Resume form
  const [resumeText, setResumeText] = useState('');
  const [resumeJobTitle, setResumeJobTitle] = useState('');

  // Cover letter form
  const [clJobTitle, setClJobTitle] = useState(searchParams.get('title') || '');
  const [clCompany, setClCompany] = useState(searchParams.get('company') || '');
  const [clJobDesc, setClJobDesc] = useState('');

  // Interview prep form
  const [ipJobTitle, setIpJobTitle] = useState(searchParams.get('title') || '');
  const [ipCompany, setIpCompany] = useState(searchParams.get('company') || '');

  // Job match form
  const [jmJobDesc, setJmJobDesc] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('/api/profile')
        .then((res) => {
          setProfile(res.data);
          if (res.data.profile?.resumeText) setResumeText(res.data.profile.resumeText);
        })
        .catch(() => {
          setProfile(null);
        });
    } else {
      setProfile(null);
    }
    if (searchParams.get('job')) setActiveTab('match');
  }, [searchParams, token]);

  const call = async (endpoint, payload, field) => {
    setLoading(true); setResult('');
    try {
      const res = await axios.post(`/api/ai/${endpoint}`, payload);
      setResult(res.data[field]);
    } catch (err) {
      setResult('❌ Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'resume', label: '📄 Resume Review' },
    { id: 'cover', label: '✉️ Cover Letter' },
    { id: 'interview', label: '🎯 Interview Prep' },
    { id: 'match', label: '📊 Job Match' },
  ];

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <h1 className="page-title">AI Career Tools ✨</h1>
      <p className="page-subtitle">Powered by Gemini Flash 2.5 to help you land your dream job</p>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => { setActiveTab(t.id); setResult(''); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Resume Review */}
      {activeTab === 'resume' && (
        <AISection title="Resume Analyzer" icon="📄">
          <div className="form-group">
            <label>Target Job Title (optional)</label>
            <input className="form-control" placeholder="e.g. Frontend Developer" value={resumeJobTitle} onChange={(e) => setResumeJobTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Your Resume Text</label>
            <textarea className="form-control" rows={8} placeholder="Paste your resume content here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          </div>
          <button
            className="btn btn-primary" disabled={loading || !resumeText}
            onClick={() => call('analyze-resume', { resumeText, jobTitle: resumeJobTitle }, 'analysis')}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </AISection>
      )}

      {/* Cover Letter */}
      {activeTab === 'cover' && (
        <AISection title="Cover Letter Generator" icon="✉️">
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input className="form-control" placeholder="Software Engineer" value={clJobTitle} onChange={(e) => setClJobTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input className="form-control" placeholder="Google" value={clCompany} onChange={(e) => setClCompany(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Job Description (optional but recommended)</label>
            <textarea className="form-control" rows={4} placeholder="Paste the job description..." value={clJobDesc} onChange={(e) => setClJobDesc(e.target.value)} />
          </div>
          <button
            className="btn btn-primary" disabled={loading || !clJobTitle || !clCompany}
            onClick={() => call('cover-letter', {
              jobTitle: clJobTitle, company: clCompany,
              jobDescription: clJobDesc,
              studentProfile: profile?.profile,
            }, 'coverLetter')}
          >
            {loading ? 'Generating...' : '✉️ Generate Cover Letter'}
          </button>
        </AISection>
      )}

      {/* Interview Prep */}
      {activeTab === 'interview' && (
        <AISection title="Interview Preparation" icon="🎯">
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input className="form-control" placeholder="Data Scientist" value={ipJobTitle} onChange={(e) => setIpJobTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company (optional)</label>
              <input className="form-control" placeholder="Microsoft" value={ipCompany} onChange={(e) => setIpCompany(e.target.value)} />
            </div>
          </div>
          <button
            className="btn btn-primary" disabled={loading || !ipJobTitle}
            onClick={() => call('interview-prep', {
              jobTitle: ipJobTitle, company: ipCompany,
              skills: profile?.profile?.skills,
            }, 'prep')}
          >
            {loading ? 'Preparing...' : '🎯 Generate Interview Prep'}
          </button>
        </AISection>
      )}

      {/* Job Match */}
      {activeTab === 'match' && (
        <AISection title="Job Match Analyzer" icon="📊">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
            Paste a job description below and see how well your profile matches it.
          </p>
          <div className="form-group">
            <label>Job Description *</label>
            <textarea className="form-control" rows={6} placeholder="Paste the full job description here..." value={jmJobDesc} onChange={(e) => setJmJobDesc(e.target.value)} />
          </div>
          {!profile?.profile?.resumeText && (
            <div className="alert alert-error" style={{ marginBottom: 12 }}>
              ⚠️ Add your resume to your profile for better match analysis.
            </div>
          )}
          <button
            className="btn btn-primary" disabled={loading || !jmJobDesc}
            onClick={() => call('job-match', {
              jobDescription: jmJobDesc,
              studentProfile: { ...profile?.profile, name: profile?.name },
            }, 'matchAnalysis')}
          >
            {loading ? 'Analyzing match...' : '📊 Analyze Job Match'}
          </button>
        </AISection>
      )}

      {/* Result */}
      {(loading || result) && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>AI is thinking...</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem' }}>✨ AI Response</h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy
                </button>
              </div>
              <div className="ai-result">{result}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
