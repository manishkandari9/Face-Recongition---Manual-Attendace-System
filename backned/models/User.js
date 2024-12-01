const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return !v || /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email format!`,
    },
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return !v || /^[0-9]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid roll number format!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String, // For storing the JWT token
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
