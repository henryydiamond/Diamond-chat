const User = require('../models/User');

const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  Query: {
    getUsers,
  },
};
