const { gql } = require('apollo-server');

module.exports = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "User" type defines the queryable fields for every user in our data source.
  type User {
    username: String!
    email: String!
  }

  type Query {
    getUsers: [User]!
  }
`;
