import React, { Fragment, useEffect } from 'react';
import { Row, Navbar, Nav } from 'react-bootstrap';
import { gql, useSubscription } from '@apollo/client';
import { useAuthDispatch, useAuthState } from '../../context/authContext';
import Users from './Users';
import Messages from './Messages';
import { useMessageDispatch } from '../../context/messageContext';

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      content
      createdAt
      from
      to
    }
  }
`;

const Home = ({ history }) => {
  const authdispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: { username: otherUser, message },
      });
    }
  }, [messageError, messageData]);

  const logout = () => {
    authdispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
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
      <Row className='m-0 bg-white holder'>
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
};

export default Home;
