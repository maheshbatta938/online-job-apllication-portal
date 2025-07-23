const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// POST /api/applications - Apply for a job
router.post('/', async (req, res) => {
  try {
    const { jobId, name, email } = req.body;
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    // Check if already applied
    const existing = await Application.findOne({ job: jobId, email });
    if (existing) return res.status(400).json({ error: 'Already applied to this job' });
    const application = new Application({ job: jobId, name, email });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/applications?email=... - List applications by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const applications = await Application.find({ email }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/applications/:id - Delete an application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 