const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Student',
      required: [true, 'Session must have a student'],
    },
    volunteer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Session must have a volunteer'],
    },
    scheduledAt: {
      type:     Date,
      required: [true, 'Scheduled date/time is required'],
    },
    duration:    { type: Number, default: 60, min: 15, max: 240 },
    status:      { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' },
    attended:    { type: Boolean },
    topics:      { type: [String] },
    notes:       { type: String, trim: true },
    feedback:    { type: String, trim: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

sessionSchema.index({ student: 1, scheduledAt: -1 });
sessionSchema.index({ volunteer: 1, scheduledAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);