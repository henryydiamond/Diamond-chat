const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();
const resolvers = require('./graphql/resolves');
const typeDefs = require('./graphql/typeDefs');
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASELOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB Connected');
  } catch (error) {
    console.log('DB Connection Error', error);
  }
};

// execute database connection
db();

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});