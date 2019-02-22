const { gql } = require('apollo-server');

module.exports = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
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
  type Subscription {
    newMessage: Message!
  }
`;
