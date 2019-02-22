import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';
import {
  useMessageDispatch,
  useMessageState,
} from '../../context/messageContext';
import Message from './Message';
import { Fragment } from 'react';

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      _id
      from
      to
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      _id
      content
      createdAt
      to
      from
    }
  }
`;

const Messages = () => {
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true);
  const [content, setContent] = useState('');
  const messages = selectedUser?.messages;
  const dispatch = useMessageDispatch();
  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);
  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  let selectedChatMarkup;

  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className='info-text'>Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className='info-text'>Loading...</p>;
  } else if (messages && messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message._id}>
        <Message message={message} />
        {index === message.length - 1 && (
          <div className='invisible'>
            <hr className='m-0' />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className='info-text'>
        You are now connected! send your first message!
      </p>
    );
  }

  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === '' || !selectedUser) return;
    // mutation for sending message
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent('');
  };

  return (
    <Col xs={10} md={8}>
      <div className='messages-box d-flex flex-column-reverse'>
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className='d-flex align-items-center'>
            <Form.Control
              type='text'
              className='rounded-pill p-4 border-0'
              style={{ backgroundColor: '#F2F3F4' }}
              placeholder='Type a message...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              className='fas fa-paper-plane fa-2x text-primary ml-2'
              onClick={submitMessage}
              role='button'
            />
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
