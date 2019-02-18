import './App.scss';
import { Container } from 'react-bootstrap';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Container className='pt-5'>
        <Router>
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/' component={Home} />
          </Switch>
        </Router>
      </Container>
    </ApolloProvider>
  );
}

export default App;
