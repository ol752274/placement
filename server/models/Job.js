const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'], default: 'Full-time' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    salary: { type: String, default: 'Not disclosed' },
    experience: { type: String, default: 'Fresher' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
      },
    ],
    isActive: { type: Boolean, default: true },
    deadline: { type: Date },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
