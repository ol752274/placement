const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'employer'], default: 'student' },
    profile: {
      bio: { type: String, default: '' },
      skills: [{ type: String }],
      education: { type: String, default: '' },
      experience: { type: String, default: '' },
      location: { type: String, default: '' },
      resumeText: { type: String, default: '' }, // pasted resume text for AI analysis
      linkedIn: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    applications: [
      {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
