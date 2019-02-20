import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Col } from 'react-bootstrap';

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
const Messages = ({ selectedUser }) => {
  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  return (
    <Col xs={8}>
      {messagesData && messagesData.getMessages.length > 0 ? (
        messagesData.getMessages.map((message) => (
          <p key={message._id}>{message.content}</p>
        ))
      ) : (
        <p>You are now connected</p>
      )}
    </Col>
  );
};

export default Messages;
