const User = require('../models/User');

const countUsers = () => User.countDocuments();

const createUser = (userData) => User.create(userData);

const findUserByEmail = (email) => User.findOne({ email });

const findUserByIdWithoutPassword = (id) => User.findById(id).select('-password');

module.exports = {
  countUsers,
  createUser,
  findUserByEmail,
  findUserByIdWithoutPassword,
};