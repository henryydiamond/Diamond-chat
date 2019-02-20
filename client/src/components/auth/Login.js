import React, { Fragment, useState } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useLazyQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../../context/authContext';

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();
  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({ type: 'LOGIN', payload: data.login });
      props.history.push('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: values });
  };

  const { username, password } = values;

  return (
    <Fragment>
      <Row
        className='authform bg-white py-5 justify-content-center'
        style={{ opacity: '70%' }}
      >
        <Col sm={8} md={6} lg={4}>
          <h1 className='text-center'>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className={errors.username && 'text-danger'}>
                {errors.username ?? 'Username'}
              </Form.Label>
              <Form.Control
                type='text'
                value={username}
                className={errors.username && 'is-invalid'}
                onChange={(e) => {
                  setValues({ ...values, username: e.target.value });
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
