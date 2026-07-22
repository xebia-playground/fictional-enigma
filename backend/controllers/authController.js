const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Registration failed.' });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Login failed.' });
  }
};

const me = (req, res) => {
  res.json({ user: authService.formatUser(req.user) });
};

module.exports = {
  login,
  me,
  register,
};