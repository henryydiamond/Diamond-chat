const { gql } = require('apollo-server');

module.exports = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type User {
    _id: ID!
    username: String!
    email: String
    token: String
    imageUrl: String
    createdAt: String!
    latestMessage: Message
  }
  type Message {
    _id: ID!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message!]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
  }
`;
