const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Student must be linked to a user account'],
      unique:   true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },
    grade: {
      type: String,
      trim: true,
      enum: { values: ['6th','7th','8th','9th','10th','11th','12th','Other'], message: 'Invalid grade' },
    },
    school:      { type: String, trim: true },
    dateOfBirth: { type: Date },
    address:     { type: String, trim: true },
    parentName:  { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    status: {
      type:    String,
      enum:    ['active', 'inactive', 'graduated'],
      default: 'active',
    },
    enrollmentDate: { type: Date, default: Date.now },
    greenPoints:    { type: Number, default: 0, min: 0 },
    notes:          { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate — fetch related records without storing them
studentSchema.virtual('assessments', { ref: 'Assessment', localField: '_id', foreignField: 'student' });
studentSchema.virtual('activities',  { ref: 'Activity',   localField: '_id', foreignField: 'student' });
studentSchema.virtual('sessions',    { ref: 'Session',    localField: '_id', foreignField: 'student' });

module.exports = mongoose.model('Student', studentSchema);