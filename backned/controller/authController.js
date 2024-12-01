const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',  // Token expiration set to 1 day
  });
};

// Regex for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

exports.signup = async (req, res) => {
  const { identifier, password } = req.body;

  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const isRollNumber = /^[0-9]+$/.test(identifier);

  if (!isEmail && !isRollNumber) {
    return res.status(400).json({ message: 'Invalid email or roll number format' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.',
    });
  }

  try {
    let user = isEmail
      ? await User.findOne({ email: identifier })
      : await User.findOne({ rollNumber: identifier });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password

    const newUser = new User({
      email: isEmail ? identifier : undefined,
      rollNumber: isRollNumber ? identifier : undefined,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);

    // Store the token in a secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Ensure this is set to true for production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000,  // Cookie expiration (1 day)
    });

    res.status(201).json({ message: 'User created successfully', token });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }],
    });

    if (!user) {
      console.log('User not found'); // Log if user is not found
      return res.status(400).json({ message: 'User not Found' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password not match' });
    }


    // Generate JWT token
    const token = generateToken(user);

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,  // 1 day expiration
    });

    res.status(200).json({ message: 'Signin successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
  

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


exports.protectedRoute = (req, res) => {
  const token = req.cookies.token; // Client ke cookies se token ko read karna

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT token verify karna
    req.user = decoded; // User info request object me attach karna
    res.status(200).json({ message: 'Access granted', user: req.user });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};


exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Fetch users excluding passwords
    res.status(200).json({ message: 'All users fetched successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};