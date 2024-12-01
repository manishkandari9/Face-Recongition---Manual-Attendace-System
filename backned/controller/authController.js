const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Password validation regex
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

// Signup handler
exports.signup = async (req, res) => {
  const { identifier, password } = req.body;

  // Validate email or roll number
  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const isRollNumber = /^[0-9]+$/.test(identifier);

  if (!isEmail && !isRollNumber) {
    return res.status(400).json({ message: 'Invalid email or roll number format' });
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    });
  }

  try {
    const existingUser = isEmail
      ? await User.findOne({ email: identifier })
      : await User.findOne({ rollNumber: identifier });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      email: isEmail ? identifier : undefined,
      rollNumber: isRollNumber ? identifier : undefined,
      password,
    });

    await newUser.save();

    const token = generateToken(newUser);
    newUser.token = token;
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signin handler
exports.signin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    user.token = token;
    await user.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout handler
exports.logout = async (req, res) => {
  try {
    // Find the user by token (which is attached to req.user by middleware)
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }

    // Remove the token from the user document
    user.token = null;
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

