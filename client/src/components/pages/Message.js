import React from 'react';
import classNames from 'classnames';
import { useAuthState } from '../../context/authContext';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Message = ({ message }) => {
  const { user } = useAuthState();

  const sent = message.from === user.username;
  const received = !sent;
  return (
    <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
        </Tooltip>
      }
    >
      <div
        className={classNames('d-flex my-3', {
          'ml-auto': sent,
          'mr-auto': received,
        })}
      >
        <div
          className={classNames('py-2 px-3 rounded-pill ', {
            'bg-primary': sent,
            receiver: received,
          })}
        >
          <p className={classNames({ 'text-white': sent })}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default Message;
