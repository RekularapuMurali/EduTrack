const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Student',
      required: [true, 'Activity must belong to a student'],
    },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type:    String,
      required:[true, 'Activity type is required'],
      enum:    { values: ['tree_plantation','recycling','water_conservation','energy_saving','other'], message: 'Invalid type' },
    },
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [100, 'Title too long'],
    },
    description:  { type: String, trim: true },
    pointsEarned: { type: Number, default: 10, min: 0, max: 100 },
    completedAt:  { type: Date, default: Date.now },
    verified:     { type: Boolean, default: false },
    verifiedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);