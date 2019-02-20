import React, { useState, Fragment } from 'react';
import { Row, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../../context/authContext';
import Users from './Users';
import Messages from './Messages';

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/login');
  };

  return (
    <Fragment>
      <Navbar bg='light' expand='lg' className='mb-3'>
        <Navbar.Brand href='#home'>MaChat</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
          <Nav>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Row className=' m-0'>
        <Users setSelectedUser={setSelectedUser} />
        <Messages selectedUser={selectedUser} />
      </Row>
    </Fragment>
  );
};

export default Home;
