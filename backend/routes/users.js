const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/users ────────────────────────────────────────
// Admin → filter by ?role=volunteer or ?status=active
// Volunteer → see other volunteers only
router.get('/', protect, async (req, res) => {
  try {
    const { role, status } = req.query;
    let filter = {};

    if (req.user.role === 'volunteer') {
      filter.role = 'volunteer';
    } else if (req.user.role === 'admin') {
      if (role)   filter.role     = role;
      if (status) filter.isActive = status === 'active';
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    const data  = users.map(u => u.toPublicJSON());

    // For volunteer list, attach student count to each volunteer
    if (!role || role === 'volunteer') {
      const withCounts = await Promise.all(
        data.map(async u => {
          const count = await Student.countDocuments({ volunteer: u._id });
          return { ...u, studentsCount: count };
        })
      );
      return res.json({ success: true, count: withCounts.length, data: withCounts });
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

// ── GET /api/users/:id (admin only) ───────────────────────
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let extra = {};
    if (user.role === 'volunteer') {
      extra.assignedStudents = await Student.find({ volunteer: user._id })
        .populate('user', 'name email');
    }

    res.json({ success: true, data: { ...user.toPublicJSON(), ...extra } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/users/:id (admin only) ───────────────────────
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const allowed = ['name','email','phone','isActive','avatar'];
    const updateData = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user.toPublicJSON() });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email already in use' });
    res.status(500).json({ success: false, message: 'Server error updating user' });
  }
});

// ── PUT /api/users/:id/status (admin only) ────────────────
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be true or false' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}`, data: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /api/users/:id (admin only) ────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Cleanup related data
    if (user.role === 'volunteer') {
      await Student.updateMany({ volunteer: user._id }, { $unset: { volunteer: '' } });
    }
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
});

module.exports = router;