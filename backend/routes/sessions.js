const express = require('express');
const router  = express.Router();
const Session = require('../models/Session');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/sessions ─────────────────────────────────────
// Supports ?student=id &status=scheduled
router.get('/', protect, async (req, res) => {
  try {
    const { student, status } = req.query;
    let filter = {};

    if (req.user.role === 'volunteer') {
      filter.volunteer = req.user._id;
    } else if (req.user.role === 'student') {
      const studentDoc = await Student.findOne({ user: req.user._id });
      if (!studentDoc) return res.json({ success: true, count: 0, data: [] });
      filter.student = studentDoc._id;
    }

    if (student) filter.student = student;
    if (status)  filter.status  = status;

    const sessions = await Session.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('volunteer', 'name email')
      .sort({ scheduledAt: -1 });

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching sessions' });
  }
});

// ── GET /api/sessions/:id ─────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('volunteer', 'name email');

    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/sessions ────────────────────────────────────
router.post('/', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const { student, scheduledAt, duration, topics, notes } = req.body;
    if (!student || !scheduledAt) {
      return res.status(400).json({ success: false, message: 'student and scheduledAt are required' });
    }

    const studentDoc = await Student.findById(student);
    if (!studentDoc) return res.status(404).json({ success: false, message: 'Student not found' });

    if (req.user.role === 'volunteer' &&
        studentDoc.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to schedule for this student' });
    }

    const session = await Session.create({
      student, scheduledAt, volunteer: req.user._id,
      duration: duration || 60,
      topics:   topics   || [],
      notes:    notes    || '',
    });

    const populated = await Session.findById(session._id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('volunteer', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error scheduling session' });
  }
});

// ── PUT /api/sessions/:id/complete ────────────────────────
router.put('/:id/complete', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: `Session is already ${session.status}` });
    }
    if (req.user.role === 'volunteer' &&
        session.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status      = 'completed';
    session.attended    = req.body.attended !== undefined ? req.body.attended : true;
    session.completedAt = new Date();
    if (req.body.feedback) session.feedback = req.body.feedback;
    if (req.body.notes)    session.notes    = req.body.notes;
    await session.save();

    res.json({ success: true, message: 'Session marked as completed', data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error completing session' });
  }
});

// ── PUT /api/sessions/:id/cancel ──────────────────────────
router.put('/:id/cancel', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: `Session is already ${session.status}` });
    }
    if (req.user.role === 'volunteer' &&
        session.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = 'cancelled';
    if (req.body.notes) session.notes = req.body.notes;
    await session.save();

    res.json({ success: true, message: 'Session cancelled', data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error cancelling session' });
  }
});

// ── PUT /api/sessions/:id ─────────────────────────────────
router.put('/:id', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: 'Can only update scheduled sessions' });
    }
    if (req.user.role === 'volunteer' &&
        session.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = {};
    ['scheduledAt','duration','topics','notes'].forEach(f => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const updated = await Session.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('volunteer', 'name email');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating session' });
  }
});

// ── DELETE /api/sessions/:id (admin only) ─────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting session' });
  }
});

module.exports = router;