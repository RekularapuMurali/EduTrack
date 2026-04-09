const express  = require('express');
const router   = express.Router();
const Activity = require('../models/Activity');
const Student  = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/activities ───────────────────────────────────
// Supports ?student=id &type=recycling &verified=true
router.get('/', protect, async (req, res) => {
  try {
    const { student, type, verified } = req.query;
    let filter = {};

    if (req.user.role === 'volunteer') {
      const myStudents = await Student.find({ volunteer: req.user._id }).select('_id');
      filter.student = { $in: myStudents.map(s => s._id) };
    } else if (req.user.role === 'student') {
      const studentDoc = await Student.findOne({ user: req.user._id });
      if (!studentDoc) return res.json({ success: true, count: 0, data: [] });
      filter.student = studentDoc._id;
    }

    if (student)              filter.student  = student;
    if (type)                 filter.type     = type;
    if (verified !== undefined) filter.verified = verified === 'true';

    const activities = await Activity.find(filter)
      .populate('student',    'user grade')
      .populate('volunteer',  'name email')
      .populate('verifiedBy', 'name')
      .sort({ completedAt: -1 });

    res.json({ success: true, count: activities.length, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching activities' });
  }
});

// ── GET /api/activities/:id ───────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('student',    'user grade school')
      .populate('volunteer',  'name email')
      .populate('verifiedBy', 'name');

    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/activities ──────────────────────────────────
router.post('/', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const { student, type, title, description, pointsEarned, completedAt } = req.body;
    if (!student || !type || !title) {
      return res.status(400).json({ success: false, message: 'student, type, and title are required' });
    }

    const studentDoc = await Student.findById(student);
    if (!studentDoc) return res.status(404).json({ success: false, message: 'Student not found' });

    if (req.user.role === 'volunteer' &&
        studentDoc.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to log activity for this student' });
    }

    const activity = await Activity.create({
      student, type, title, description,
      pointsEarned: pointsEarned || 10,
      completedAt:  completedAt  || Date.now(),
      volunteer:    req.user._id,
    });

    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error creating activity' });
  }
});

// ── PUT /api/activities/:id/verify ────────────────────────
// Marks verified + adds points to student greenPoints
router.put('/:id/verify', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)       return res.status(404).json({ success: false, message: 'Activity not found' });
    if (activity.verified) return res.status(400).json({ success: false, message: 'Activity already verified' });

    activity.verified   = true;
    activity.verifiedBy = req.user._id;
    activity.verifiedAt = new Date();
    await activity.save();

    // Add points to student
    await Student.findByIdAndUpdate(activity.student, { $inc: { greenPoints: activity.pointsEarned } });

    res.json({ success: true, message: `Activity verified. ${activity.pointsEarned} points added.`, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error verifying activity' });
  }
});

// ── PUT /api/activities/:id ───────────────────────────────
router.put('/:id', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)        return res.status(404).json({ success: false, message: 'Activity not found' });
    if (activity.verified) return res.status(400).json({ success: false, message: 'Cannot edit a verified activity' });

    if (req.user.role === 'volunteer' &&
        activity.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this activity' });
    }

    const updateData = {};
    ['type','title','description','pointsEarned','completedAt'].forEach(f => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const updated = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating activity' });
  }
});

// ── DELETE /api/activities/:id ────────────────────────────
router.delete('/:id', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (activity.verified && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete a verified activity' });
    }

    // Subtract points if already verified
    if (activity.verified) {
      await Student.findByIdAndUpdate(activity.student, { $inc: { greenPoints: -activity.pointsEarned } });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting activity' });
  }
});

module.exports = router;