const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, employerOnly } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');

    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({ jobs, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create job (employer only)
router.post('/', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job (employer only)
router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete job (employer only)
router.delete('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply for a job (student only)
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = job.applicants.some((a) => a.user.toString() === req.user._id.toString());
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    job.applicants.push({ user: req.user._id });
    await job.save();

    // Also update user's applications array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { applications: { job: job._id } },
    });

    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save / unsave job (student only)
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ saved: !isSaved, message: isSaved ? 'Job unsaved' : 'Job saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get employer's posted jobs
router.get('/employer/mine', protect, employerOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applicants for a job (employer only)
router.get('/:id/applicants', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants.user', 'name email profile');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
