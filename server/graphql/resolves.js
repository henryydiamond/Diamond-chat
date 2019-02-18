const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    console.error(err);
  }
};

const register = async (_, args) => {
  let errors = {};
  let { username, email, password, confirmPassword } = args;
  try {
    // Fields Validation
    if (email.trim() === '') errors.email = 'Email is required';
    if (password.trim() === '') errors.password = 'Password is required';
    if (username.trim() === '') errors.username = 'Username is required';
    if (confirmPassword.trim() === '')
      errors.confirmPassword = 'Confirm Password is required';
    if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    // Making sure user does not exist
    let user = await User.findOne({ email: email }).exec();
    if (user) errors.user = 'User already exist';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    // New instance of user
    user = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
    throw new UserInputError('Bad Input', { errors: err });
  }
};

const login = async (_, args) => {
  let errors = {};
  let { email, password } = args;
  try {
    if (email.trim() === '') errors.email = 'Email must not be empty';
    if (password.trim() === '') errors.password = 'Password must not be empty';

    if (Object.keys(errors).length > 0) {
      throw new UserInputError('Bad Input', { errors });
    }
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      errors.email = 'User does not exist';
      throw new UserInputError('User does not exist', { errors });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = 'password is incorrect';
      throw new AuthenticationError('password is incorrect', { errors });
    }

    const token = jwt.sign({ email }, process.env.JWTSECRET, {
      expiresIn: 60 * 60,
    });
    user.token = token;
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  Query: {
    getUsers,
    login,
  },
  Mutation: {
    register,
  },
};
