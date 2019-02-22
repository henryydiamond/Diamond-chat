const User = require('../../models/User');
const Message = require('../../models/Message');

const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter,
} = require('apollo-server');

const Reaction = require('../../models/Reaction');

const sendMessage = async (_, args, { user, pubsub }) => {
  try {
    if (!user) throw new AuthenticationError('Unauthenticated');
    const recipient = await User.findOne({ username: args.to }).exec();
    if (!recipient) {
      throw new UserInputError('User not found');
    } else if (recipient.username === user.username) {
      throw new UserInputError(
        'Unauthorized action, You cant message your self'
      );
    }

    if (args.content.trim() === '') {
      throw new UserInputError('Message is empty');
    }

    let message = new Message({
      ...args,
      from: user.username,
    });

    await message.save();
    pubsub.publish('NEW_MESSAGE', { newMessage: message });
    return {
      ...message.toJSON(),
      createdAt: message.createdAt.toISOString(),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const reactToMessage = async (_, { _id, content }, { user, pubsub }) => {
  const reactions = [
    '❤️',
    '😂',
    '😭',
    '😒',
    '👌',
    '😘',
    '💕',
    '😁',
    '🙈',
    '😡',
    '🥶',
    '👎',
    '🤙',
  ];
  try {
    // Validate reaction content
    if (!reactions.includes(content)) {
      throw new UserInputError('Invalid reaction');
    }
    // Get user
    const username = user ? user.username : '';
    user = await User.findOne({ username: username });
    if (!user) throw new AuthenticationError('Unauthenticated');
    // Get message
    const message = await Message.findOne({ _id: _id });
    if (!message) throw new UserInputError('message not found');
    if (message.from !== user.username && message.to !== user.username) {
      throw new ForbiddenError('Unauthorized');
    }
    let reaction = await Reaction.findOne({
      messageId: message._id,
      userId: user._id,
    });
    if (reaction) {
      // Reaction exist, update it
      reaction.content = content;
      await reaction.save();
    } else {
      // Reaction doesnt exist, create it
      reaction = new Reaction({
        messageId: message._id,
        userId: user._id,
        content,
      });
      await reaction.save();
    }
    pubsub.publish('NEW_REACTION', { newReaction: reaction });
    return reaction;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getMessages = async (_, args, { user }) => {
  try {
    if (!user) throw new AuthenticationError('Unauthenticated');

    const otherUser = await User.findOne({ username: args.from }).exec();

    if (!otherUser) throw new UserInputError('User  not find');
    const userNames = [user.username, otherUser.username];
    let messages = await Message.find({
      $and: [{ from: userNames }, { to: userNames }],
    })
      .sort({ createdAt: -1 })
      .exec();
    return messages;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  Query: {
    getMessages,
  },
  Mutation: {
    sendMessage,
    reactToMessage,
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthorised');
          return pubsub.asyncIterator('NEW_MESSAGE');
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthorised');
          return pubsub.asyncIterator('NEW_REACTION');
        },
        async ({ newReaction }, _, { user }) => {
          const message = await Message.findOne({ _id: newReaction.messageId });
          console.log('newReaction', message.from);
          if (message.from === user.username || message.to === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
