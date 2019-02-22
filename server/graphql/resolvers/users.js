const User = require('../../models/User');
const Message = require('../../models/Message');
const bcrypt = require('bcryptjs');
const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter,
} = require('apollo-server');
const jwt = require('jsonwebtoken');

const getUsers = async (_, __, { user }) => {
  try {
    if (!user) throw new AuthenticationError('Unauthenticated');

    let users = await User.find({ username: { $ne: user.username } }).select(
      '-email -password'
    );
    const allUserMessages = await Message.find({
      $or: [{ from: user.username.toString() }, { to: user.username }],
    }).sort({ createdAt: 'DESC' });

    users = users.map((otherUser) => {
      const latestMessage = allUserMessages.find(
        (m) => m.from === otherUser.username || m.to === otherUser.username
      );
      otherUser.latestMessage = latestMessage;
      return otherUser;
    });

    return users;
  } catch (err) {
    console.error(err);
    throw err;
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
    let user = await User.findOne({ username: username }).exec();
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
  let { username, password } = args;
  try {
    if (username.trim() === '') errors.username = 'Email must not be empty';
    if (password.trim() === '') errors.password = 'Password must not be empty';

    if (Object.keys(errors).length > 0) {
      throw new UserInputError('Bad Input', { errors });
    }
    const user = await User.findOne({ username: username }).exec();

    if (!user) {
      errors.username = 'User does not exist';
      throw new UserInputError('User does not exist', { errors });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = 'password is incorrect';
      throw new UserInputError('password is incorrect', { errors });
    }

    const token = jwt.sign({ username }, process.env.JWTSECRET, {
      expiresIn: 60 * 60,
    });

    return {
      ...user.toJSON(),
      token,
    };
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
