const express    = require('express');
const router     = express.Router();
const Assessment = require('../models/Assessment');
const Student    = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/assessments?student=<id> ─────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { student } = req.query;
    if (!student) return res.status(400).json({ success: false, message: 'student query param is required' });

    // Students can only access their own assessments
    if (req.user.role === 'student') {
      const studentDoc = await Student.findOne({ user: req.user._id });
      if (!studentDoc || studentDoc._id.toString() !== student) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const assessments = await Assessment.find({ student })
      .populate('volunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: assessments.length, data: assessments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching assessments' });
  }
});

// ── GET /api/assessments/:id ──────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('student',   'greenPoints grade school')
      .populate('volunteer', 'name email');

    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/assessments ─────────────────────────────────
router.post('/', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const { student, period, subjects, remarks } = req.body;
    if (!student || !period || !subjects?.length) {
      return res.status(400).json({ success: false, message: 'student, period, and subjects are required' });
    }

    const studentDoc = await Student.findById(student);
    if (!studentDoc) return res.status(404).json({ success: false, message: 'Student not found' });

    if (req.user.role === 'volunteer' &&
        studentDoc.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to assess this student' });
    }

    // Prevent duplicate period
    const existing = await Assessment.findOne({ student, period });
    if (existing) {
      return res.status(400).json({ success: false, message: `Assessment for ${period} already exists. Use PUT to update.` });
    }

    const assessment = await Assessment.create({ student, period, subjects, remarks, volunteer: req.user._id });
    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error('Assessment create error:', err);
    res.status(500).json({ success: false, message: 'Server error creating assessment' });
  }
});

// ── PUT /api/assessments/:id ──────────────────────────────
router.put('/:id', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (req.user.role === 'volunteer' &&
        assessment.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = {};
    ['subjects','remarks','period'].forEach(f => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const updated = await Assessment.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating assessment' });
  }
});

// ── DELETE /api/assessments/:id (admin only) ──────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;