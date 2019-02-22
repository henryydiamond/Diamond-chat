import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Col, Spinner, Alert, Image } from 'react-bootstrap';
import classNames from 'classnames';
import {
  useMessageDispatch,
  useMessageState,
} from '../../context/messageContext';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        _id
        from
        to
        content
        createdAt
      }
    }
  }
`;

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: 'SET_USERS', payload: data.getUsers }),
    onError: (err) => console.log(err),
  });

  let usersMarkup;
  if (!users && loading) {
    usersMarkup = <Spinner animation='grow' />;
  } else if (users && users.length === 0) {
    usersMarkup = (
      <Alert variant='info'>No users have joined this platform yet</Alert>
    );
  } else if (users && users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role='button'
          className={classNames(
            'user-div d-flex justify-content-center justify-content-md-start p-3',
            {
              'bg-white': selected,
            }
          )}
          key={user._id}
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_USER', payload: user.username })
          }
        >
          <Image
            src='https://cdn.pixabay.com/photo/2021/05/02/07/56/child-6222810_1280.png'
            className='user-image '
          />
          <div className='d-none d-md-block ml-2'>
            <p className='text-success'>{user.username}</p>
            <p className='font-weight-light'>
              {user.latestMessage
                ? user.latestMessage.content
                : 'You are connected'}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col className='bg-primary p-0' xs={2} md={4}>
      {usersMarkup}
    </Col>
  );
};

export default Users;
