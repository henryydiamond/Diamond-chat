import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Col, Spinner, Alert, Image } from 'react-bootstrap';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        from
        to
        content
      }
    }
  }
`;

const Users = ({ setSelectedUser }) => {
  const { loading, data, error } = useQuery(GET_USERS);
  let usersMarkup;
  if (!data && loading) {
    usersMarkup = <Spinner animation='grow' />;
  } else if (data.getUsers.length === 0) {
    usersMarkup = (
      <Alert variant='info'>No users have joined this platform yet</Alert>
    );
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div
        className='d-flex p-3'
        key={user._id}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src='https://source.unsplash.com/user/erondu/1600x900'
          roundedCircle
          className='mr-2'
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
        <div>
          <p className='text-success'>{user.username}</p>
          <p className='font-weight-light'>
            {user.latestMessage
              ? user.latestMessage.content
              : 'You are connected'}
          </p>
        </div>
      </div>
    ));
  }
  return (
    <Col
      className=' p-0'
      xs={4}
      style={{
        backgroundColor: ' #8EC5FC',
        opacity: '85%',

        backgroundImage:
          'linear-gradient(62deg, #8EC5FC 0%, #ffffff 49%, #E0C3FC 98%)',
      }}
    >
      {usersMarkup}
    </Col>
  );
};

export default Users;
