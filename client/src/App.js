import './App.scss';
import { Container } from 'react-bootstrap';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import { AuthProvider } from './context/authContext';
import DynamicRoutes from './DynamicRoutes';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
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
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
