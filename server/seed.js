/**
 * Seed script — run once to populate sample data
 * Usage: node seed.js
 */
require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobplace';

const sampleJobs = [
  {
    title: 'Frontend Developer Intern',
    company: 'TechCorp India',
    location: 'Bengaluru',
    type: 'Internship',
    description: 'We are looking for a passionate frontend developer intern to join our product team. You will work on building user interfaces using React.js and collaborate with designers and backend engineers.',
    requirements: ['Pursuing or completed B.Tech/B.E.', 'Basic knowledge of React.js', 'Understanding of HTML, CSS, JavaScript', 'Good communication skills'],
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    salary: '₹15,000/month',
    experience: 'Fresher',
  },
  {
    title: 'Backend Developer',
    company: 'Startup Hub',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our growing startup as a backend developer. You will design and build scalable REST APIs, work with databases, and help architect our core product infrastructure.',
    requirements: ['1-2 years experience with Node.js', 'Experience with MongoDB or PostgreSQL', 'Understanding of RESTful API design', 'Familiarity with Docker'],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Docker'],
    salary: '₹6-10 LPA',
    experience: '0-1 years',
  },
  {
    title: 'Data Science Intern',
    company: 'Analytics Pro',
    location: 'Hyderabad',
    type: 'Internship',
    description: 'Exciting opportunity to work on real-world data science projects. You will analyze large datasets, build ML models, and present insights to stakeholders.',
    requirements: ['Strong Python programming skills', 'Knowledge of pandas, numpy, scikit-learn', 'Basic statistics and probability', 'Currently pursuing or completed degree in CS/Stats'],
    skills: ['Python', 'Machine Learning', 'pandas', 'scikit-learn', 'SQL'],
    salary: '₹20,000/month',
    experience: 'Fresher',
  },
  {
    title: 'UI/UX Designer',
    company: 'DesignFirst',
    location: 'Mumbai',
    type: 'Full-time',
    description: 'We need a creative UI/UX designer to craft delightful user experiences for our mobile and web applications. You will own the design process from research to final delivery.',
    requirements: ['Portfolio demonstrating UI/UX work', 'Proficiency in Figma', 'Understanding of user-centered design', 'Basic knowledge of design systems'],
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
    salary: '₹5-8 LPA',
    experience: '0-1 years',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudBase',
    location: 'Pune',
    type: 'Full-time',
    description: 'Help us build and maintain our cloud infrastructure. You will work with AWS, set up CI/CD pipelines, monitor systems, and ensure high availability of our platform.',
    requirements: ['Experience with AWS or Azure', 'Knowledge of Docker and Kubernetes', 'Scripting with Bash or Python', 'Understanding of networking concepts'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    salary: '₹8-14 LPA',
    experience: '1-2 years',
  },
  {
    title: 'Full Stack Developer',
    company: 'Innovate Labs',
    location: 'Remote',
    type: 'Remote',
    description: 'Work on exciting full-stack projects using modern technologies. You will build features end-to-end, from database design to frontend implementation.',
    requirements: ['Experience with React and Node.js', 'Database design skills', 'Problem-solving aptitude', 'Self-motivated with ability to work remotely'],
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'GraphQL'],
    salary: '₹10-16 LPA',
    experience: '1-2 years',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});

    // Create employer user
    const employer = await User.create({
      name: 'Demo Employer',
      email: 'employer@demo.com',
      password: 'password123',
      role: 'employer',
    });

    // Create student user
    await User.create({
      name: 'Demo Student',
      email: 'student@demo.com',
      password: 'password123',
      role: 'student',
      profile: {
        bio: 'Computer Science final year student passionate about web development',
        skills: ['React', 'JavaScript', 'Python', 'Node.js'],
        education: 'B.Tech Computer Science, VTU, 2024',
        experience: '6-month internship at local startup',
        location: 'Bengaluru',
      },
    });

    // Create jobs
    const jobs = await Job.insertMany(
      sampleJobs.map((job) => ({ ...job, postedBy: employer._id }))
    );

    console.log(`✅ Seeded ${jobs.length} jobs`);
    console.log('✅ Demo accounts created:');
    console.log('   Student: student@demo.com / password123');
    console.log('   Employer: employer@demo.com / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
