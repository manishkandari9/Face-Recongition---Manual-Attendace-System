const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,  // Allows one field to be null and still unique
    validate: {
      validator: function (v) {
        return !v || /\S+@\S+\.\S+/.test(v);  // Email format validation
      },
      message: (props) => `${props.value} is not a valid email format!`,
    },
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,  // Allows one field to be null and still unique
    validate: {
      validator: function (v) {
        return !v || /^[0-9]+$/.test(v);  // Roll number should be digits only
      },
      message: (props) => `${props.value} is not a valid roll number format!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });  



const User = mongoose.model('User', userSchema);
module.exports = User;
