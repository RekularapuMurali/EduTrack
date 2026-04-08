const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never returned in queries
    },
    role: {
      type:     String,
      enum:     { values: ['admin', 'volunteer', 'student'], message: 'Invalid role' },
      required: [true, 'Role is required'],
    },
    isActive: { type: Boolean, default: true },
    phone:    { type: String, trim: true },
    avatar:   { type: String },
    lastLogin:{ type: Date },
  },
  { timestamps: true }
);

// Hash password before save (only when modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return public profile without password
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id, name: this.name, email: this.email,
    role: this.role, isActive: this.isActive,
    phone: this.phone, avatar: this.avatar, createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);