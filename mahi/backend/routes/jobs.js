const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/jobs - List all jobs or search
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const jobs = await Job.find(query).sort({ datePosted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs - Add a job (for testing/demo)
router.post('/', async (req, res) => {
  try {
    const { title, description, company, location } = req.body;
    const job = new Job({ title, description, company, location });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 