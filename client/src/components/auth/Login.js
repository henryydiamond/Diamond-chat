import React, { Fragment, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useLazyQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const LOGIN_USER = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      username
      email
      createdAt
      token
    }
  }
`;
export const Login = (props) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      props.history.push('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: values });
  };

  const { email, password } = values;
  return (
    <Fragment>
      <Row className='authform bg-white py-5 justify-content-center'>
        <Col sm={8} md={6} lg={4}>
          <h1 className='text-center'>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className={errors.email && 'text-danger'}>
                {errors.email ?? 'Email address'}
              </Form.Label>
              <Form.Control
                type='email'
                value={email}
                className={errors.email && 'is-invalid'}
                onChange={(e) => {
                  setValues({ ...values, email: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className={errors.password && 'text-danger'}>
                {errors.password ?? 'Password'}
              </Form.Label>
              <Form.Control
                type='password'
                value={password}
                className={errors.password && 'is-invalid'}
                onChange={(e) => {
                  setValues({ ...values, password: e.target.value });
                }}
              />
            </Form.Group>

            <div className='text-center'>
              <Button variant='success' type='submit' disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </Button>
              <br />
              <small>
                Don't have an account ? <Link to='/register'>Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};
