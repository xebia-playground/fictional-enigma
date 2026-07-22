const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/userRepository');

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

const registerUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error('Username, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const userCount = await userRepository.countUsers();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
    role: userCount === 0 ? 'admin' : 'user',
  });

  return { token: createToken(user), user: formatUser(user) };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  return { token: createToken(user), user: formatUser(user) };
};

module.exports = {
  formatUser,
  loginUser,
  registerUser,
};