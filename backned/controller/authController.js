const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User'); // Import your User model

exports.signup = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  try {
    // Check if identifier is email or rollNumber
    const isEmail = identifier.includes('@');
    const isRollNumber = /^\d+$/.test(identifier); // Check if identifier is numeric for rollNumber

    if (!isEmail && !isRollNumber) {
      return res.status(400).json({ message: 'Invalid identifier. Provide a valid email or roll number.' });
    }

    // Check if user already exists
    const userExists = isEmail
      ? await User.findOne({ email: identifier })
      : await User.findOne({ rollNumber: identifier });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email: isEmail ? identifier : undefined,
      rollNumber: isRollNumber ? identifier : undefined,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


exports.signin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  try {
    // Find the user based on identifier (email or rollNumber)
    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    user.token = token; // Store the token in the database
    await user.save();

    res.status(200).json({ message: 'Signin successful.', token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
