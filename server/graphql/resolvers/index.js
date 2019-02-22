const userResolvers = require('./users');
const messageResolvers = require('./messages');
const User = require('../../models/User');
const Message = require('../../models/Message');

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    message: async (parent) => await Message.findById(parent.messageId),
    user: async (parent) => await User.findById(parent.userId).select('-email'),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
