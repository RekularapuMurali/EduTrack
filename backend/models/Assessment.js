const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, 'Subject name required'], trim: true },
    score: { type: Number, required: [true, 'Score required'], min: 0, max: 100 },
    grade: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Student',
      required: [true, 'Assessment must belong to a student'],
    },
    volunteer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Assessment must be submitted by a volunteer'],
    },
    period: {
      type:     String,
      required: [true, 'Period is required'],
      trim:     true,
    },
    subjects: {
      type:     [subjectSchema],
      validate: { validator: arr => arr.length > 0, message: 'At least one subject required' },
    },
    overallScore: { type: Number, min: 0, max: 100 },
    remarks:      { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-calculate overall score
assessmentSchema.pre('save', function () {
  if (this.subjects?.length > 0) {
    const total = this.subjects.reduce((sum, s) => sum + s.score, 0);
    this.overallScore = Math.round(total / this.subjects.length);
  }
});

// One assessment per student per period
assessmentSchema.index({ student: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Assessment', assessmentSchema);