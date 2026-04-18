const express = require('express');
const router  = express.Router();
const Student = require('../models/Student');
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/students ─────────────────────────────────────
// Admin → all students | Volunteer → assigned only | Student → own
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'volunteer')  filter = { volunteer: req.user._id };
    if (req.user.role === 'student')    filter = { user: req.user._id };

    const students = await Student.find(filter)
      .populate('user',      'name email phone avatar')
      .populate('volunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching students' });
  }
});

// ── GET /api/students/:id ─────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user',      'name email phone avatar')
      .populate('volunteer', 'name email phone')
      .populate('assessments')
      .populate('activities')
      .populate('sessions');

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Student can only see own profile
    if (req.user.role === 'student' &&
        student.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching student' });
  }
});

// ── POST /api/students ────────────────────────────────────
// Creates User account + Student profile together
router.post('/', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    const {
      name, email, password,
      grade, school, dateOfBirth, address,
      parentName, parentPhone, volunteerId, notes,
    } = req.body;

    const initialPassword = password || 'password123';

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password: initialPassword, role: 'student' });

    // Auto-assign to volunteer if they created this student
    let assignedVolunteer = volunteerId || undefined;
    if (req.user.role === 'volunteer' && !volunteerId) {
      assignedVolunteer = req.user._id;
    }

    const student = await Student.create({
      user: user._id, volunteer: assignedVolunteer,
      grade, school, dateOfBirth, address, parentName, parentPhone, notes,
    });

    const populated = await Student.findById(student._id)
      .populate('user', 'name email').populate('volunteer', 'name email');

    res.status(201).json({
      success: true,
      data: populated,
      login: {
        email: user.email,
        password: initialPassword,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error creating student' });
  }
});

// ── PUT /api/students/:id ─────────────────────────────────
router.put('/:id', protect, authorize('admin', 'volunteer'), async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Volunteer can only update their own students
    if (req.user.role === 'volunteer' &&
        student.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this student' });
    }

    const allowed = ['grade','school','dateOfBirth','address','parentName','parentPhone','status','notes'];
    if (req.user.role === 'admin') allowed.push('volunteer');

    const updateData = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('user', 'name email').populate('volunteer', 'name email');

    res.json({ success: true, data: student });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error updating student' });
  }
});

// ── DELETE /api/students/:id (admin only) ─────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    await User.findByIdAndDelete(student.user);    // delete user account
    await Student.findByIdAndDelete(req.params.id); // delete profile

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting student' });
  }
});

// ── PUT /api/students/:id/assign (admin only) ─────────────
router.put('/:id/assign', protect, authorize('admin'), async (req, res) => {
  try {
    const { volunteerId } = req.body;
    if (volunteerId) {
      const vol = await User.findById(volunteerId);
      if (!vol || vol.role !== 'volunteer') {
        return res.status(400).json({ success: false, message: 'Invalid volunteer ID' });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id, { volunteer: volunteerId || null }, { new: true }
    ).populate('user', 'name email').populate('volunteer', 'name email');

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error assigning volunteer' });
  }
});

module.exports = router;