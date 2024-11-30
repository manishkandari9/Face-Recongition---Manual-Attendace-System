const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',  
  });
};

// Regex for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

exports.signup = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if identifier is an email or roll number
  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const isRollNumber = /^[0-9]+$/.test(identifier);

  if (!isEmail && !isRollNumber) {
    return res.status(400).json({ message: 'Invalid email or roll number format' });
  }

  // Validate password with regex
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    });
  }

  try {
    let user = isEmail
      ? await User.findOne({ email: identifier })
      : await User.findOne({ rollNumber: identifier });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      email: isEmail ? identifier : undefined,
      rollNumber: isRollNumber ? identifier : undefined,
      password: password,  
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { identifier, password } = req.body;

  // Validate password with regex
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }]
    });

    if (!user || user.password !== password) { 
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
