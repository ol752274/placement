const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-flash-2.5';

async function callGemini(promptText) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${GEMINI_MODEL}:generateText?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: { text: promptText },
      maxOutputTokens: 1000,
      temperature: 0.2,
      topP: 0.95,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();
  const output = data?.candidates?.[0]?.output;
  if (!output) {
    throw new Error('No output received from Gemini API');
  }

  return output;
}

// Analyze resume and suggest improvements
router.post('/analyze-resume', protect, async (req, res) => {
  try {
    const { resumeText, jobTitle } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'Resume text is required' });

    const prompt = `You are an expert career counselor and resume reviewer helping students land their first jobs. Give concise, actionable feedback. Be encouraging but honest. Format your response with clear sections.\n\nPlease analyze this resume${jobTitle ? ` for a ${jobTitle} position` : ''}:\n\n${resumeText}\n\nProvide:\n1. Overall score (out of 10)\n2. Key strengths (2-3 points)\n3. Areas to improve (2-3 points)\n4. Missing sections or information\n5. Top 3 actionable tips`;

    const analysis = await callGemini(prompt);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate cover letter
router.post('/cover-letter', protect, async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, studentProfile } = req.body;
    if (!jobTitle || !company) return res.status(400).json({ message: 'Job title and company are required' });

    const prompt = `You are an expert career coach who writes compelling, personalized cover letters for students. Write in a professional yet authentic tone. Keep it concise (3-4 paragraphs).\n\nWrite a cover letter for:\nJob: ${jobTitle} at ${company}\n${jobDescription ? `Job Description: ${jobDescription}\n` : ''}${studentProfile ? `Student Profile: ${JSON.stringify(studentProfile)}\n` : ''}\nThe cover letter should be professional, specific, and highlight relevant skills.`;

    const coverLetter = await callGemini(prompt);
    res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Interview preparation questions
router.post('/interview-prep', protect, async (req, res) => {
  try {
    const { jobTitle, company, skills } = req.body;
    if (!jobTitle) return res.status(400).json({ message: 'Job title is required' });

    const prompt = `You are an expert interview coach helping students prepare for job interviews. Provide realistic questions and model answers. Be practical and encouraging.\n\nGenerate interview preparation for:\nRole: ${jobTitle}${company ? ` at ${company}` : ''}\n${skills ? `Relevant Skills: ${skills.join(', ')}\n` : ''}\nProvide:\n1. 5 likely interview questions with brief answer guidance\n2. 2 questions the student should ask the interviewer\n3. One key tip for this specific role`;

    const prep = await callGemini(prompt);
    res.json({ prep });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Job match analysis
router.post('/job-match', protect, async (req, res) => {
  try {
    const { jobDescription, studentProfile } = req.body;
    if (!jobDescription || !studentProfile) {
      return res.status(400).json({ message: 'Job description and profile are required' });
    }

    const prompt = `You are a career advisor helping students understand how well they match job requirements. Be honest, encouraging, and specific with actionable advice.\n\nAnalyze the match between this student profile and job:\n\nStudent Profile:\n${JSON.stringify(studentProfile, null, 2)}\n\nJob Description:\n${jobDescription}\n\nProvide:\n1. Match score (percentage)\n2. Matching skills/qualifications\n3. Gaps to address\n4. Whether to apply and why`;

    const matchAnalysis = await callGemini(prompt);
    res.json({ matchAnalysis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
