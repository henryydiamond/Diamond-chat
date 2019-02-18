import React, { Fragment, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export const Register = () => {
  const [values, setValues] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  const { email, username, password, password2 } = values;
  return (
    <Fragment>
      <Row className='authform bg-white py-5 justify-content-center'>
        <Col sm={8} md={6} lg={4}>
          <h1 className='text-center'>Register</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => {
                  setValues({ ...values, email: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={(e) => {
                  setValues({ ...values, username: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={(e) => {
                  setValues({ ...values, password: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                value={password2}
                onChange={(e) => {
                  setValues({ ...values, password2: e.target.value });
                }}
              />
            </Form.Group>
            <div className='text-center'>
              <Button variant='success' type='submit'>
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};
