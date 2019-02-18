import './App.scss';
import { Container } from 'react-bootstrap';
import { Register } from './components/auth/Register';

function App() {
  return (
    <Container className='pt-5'>
      <Register />
    </Container>
  );
}

export default App;
