const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get own profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedJobs', 'title company location type')
      .populate('applications.job', 'title company location');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, profile } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (profile) updates.profile = { ...req.user.profile, ...profile };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
