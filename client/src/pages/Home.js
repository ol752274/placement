import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
  { icon: '🤖', title: 'AI Resume Review', desc: 'Get instant feedback on your resume with actionable improvements.' },
  { icon: '✉️', title: 'Cover Letter Generator', desc: 'Generate tailored cover letters for any job in seconds.' },
  { icon: '🎯', title: 'Interview Prep', desc: 'Practice with AI-generated questions specific to your target role.' },
  { icon: '📊', title: 'Job Match Score', desc: 'See how well your profile matches any job before applying.' },
];

const stats = [
  { number: '500+', label: 'Jobs Posted' },
  { number: '2,000+', label: 'Students Placed' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '150+', label: 'Companies Hiring' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-content container">
          <div className="hero-badge">✨ AI-Powered Career Platform</div>
          <h1 className="hero-title">
            Land Your Dream Job<br />
            <span className="hero-accent">Faster with AI</span>
          </h1>
          <p className="hero-subtitle">
            Resume analysis, cover letters, interview prep — all powered by AI.
            Built specifically for students entering the workforce.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
                <Link to="/ai-tools" className="btn btn-outline">AI Tools ✨</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get Started Free →</Link>
                <Link to="/jobs" className="btn btn-outline">Browse Jobs</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section container">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Everything You Need to Get Hired
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>
          Our AI tools give you the edge in today's competitive job market
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section container">
          <div className="cta-box">
            <h2>Ready to Start Your Career Journey?</h2>
            <p>Join thousands of students who've already landed their dream jobs.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <Link to="/register?role=student" className="btn btn-primary">I'm a Student</Link>
              <Link to="/register?role=employer" className="btn btn-outline">I'm an Employer</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
