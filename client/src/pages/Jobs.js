import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

function JobCard({ job }) {
  const typeColors = {
    'Full-time': 'badge-green',
    'Internship': 'badge-purple',
    'Part-time': 'badge-yellow',
    'Contract': 'badge-yellow',
    'Remote': 'badge-purple',
  };

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div>
        <div className="job-card-title">{job.title}</div>
        <div className="job-card-company">🏢 {job.company}</div>
      </div>
      <div className="job-card-meta">
        <span className={`badge ${typeColors[job.type] || 'badge-gray'}`}>{job.type}</span>
        <span className="badge badge-gray">📍 {job.location}</span>
        {job.salary && job.salary !== 'Not disclosed' && (
          <span className="badge badge-green">💰 {job.salary}</span>
        )}
      </div>
      {job.skills?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="tag">+{job.skills.length - 4}</span>}
        </div>
      )}
      <div className="job-card-footer">
        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>View →</span>
      </div>
    </Link>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [location, setLocation] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (appliedSearch) params.search = appliedSearch;
      if (type !== 'All') params.type = type;
      if (appliedLocation) params.location = appliedLocation;

      const res = await api.get('/api/jobs', { params });
      setJobs(res.data.jobs);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [appliedLocation, appliedSearch, page, type]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(search);
    setAppliedLocation(location);
    setPage(1);
  };

  return (
    <div className="page">
      <h1 className="page-title">Browse Jobs</h1>
      <p className="page-subtitle">Find opportunities that match your skills and goals</p>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          className="form-control"
          style={{ flex: 2, minWidth: 200 }}
          placeholder="Search by role, company, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="form-control"
          style={{ flex: 1, minWidth: 140 }}
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Type filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {JOB_TYPES.map((t) => (
          <button
            key={t}
            className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setType(t); setPage(1); }}
          >
            {t}
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
        {total} job{total !== 1 ? 's' : ''} found
      </p>

      {/* Jobs grid */}
      {loading ? (
        <div className="loading-inline"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🔍</div>
          <p>No jobs found. Try different search terms.</p>
        </div>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: 32 }}>
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >← Prev</button>
              <span style={{ padding: '6px 14px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
