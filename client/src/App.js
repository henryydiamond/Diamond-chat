import './App.scss';
import { Container } from 'react-bootstrap';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import { AuthProvider } from './context/authContext';
import { MessageProvider } from './context/messageContext';
import DynamicRoutes from './DynamicRoutes';

let httpLink = createHttpLink({
  uri: process.env.REACT_APP_GQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
httpLink = authLink.concat(httpLink);
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GQL_WS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <MessageProvider>
          <Router>
            <Container className='pt-5'>
              <Switch>
                <DynamicRoutes
                  exact
                  path='/register'
                  component={Register}
                  guest
                />
                <DynamicRoutes exact path='/login' component={Login} guest />
                <DynamicRoutes exact path='/' component={Home} authenticated />
              </Switch>
            </Container>
          </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
