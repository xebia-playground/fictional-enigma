const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'devshop-local-secret',
    { expiresIn: '2h' }
  );
};

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const userCount = await User.countDocuments();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userCount === 0 ? 'admin' : 'user',
    });

    res.status(201).json({ token: createToken(user), user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
});

router.post('/login', (req, res) => {
  const login = async () => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({ token: createToken(user), user: formatUser(user) });
  };

  login().catch((error) => {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: formatUser(req.user) });
});

module.exports = router;
