const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Session',
      required: true,
      unique:   true,
    },
    student:       { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    volunteer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    present:       { type: Boolean, default: false },
    absenceReason: { type: String, trim: true },
    markedAt:      { type: Date, default: Date.now },
    markedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);