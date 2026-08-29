const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: 'Friendly neighborhood tool sharer and helper!' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: true },
    isHelper: { type: Boolean, default: false },
    helperSkills: [{ type: String }],
    hourlyRate: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [-73.935242, 40.73061] },
      city: { type: String, default: 'New York' },
      area: { type: String, default: 'Manhattan' },
      state: { type: String, default: 'NY' },
      pincode: { type: String, default: '10001' },
      address: { type: String, default: 'Manhattan, New York, NY 10001' }
    },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
