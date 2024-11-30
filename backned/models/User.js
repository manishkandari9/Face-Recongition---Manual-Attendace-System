const mongoose = require('mongoose');

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
    type: String, // Token will be stored here
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
