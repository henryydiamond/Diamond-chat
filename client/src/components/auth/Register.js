import React, { Fragment, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      _id
      username
      email
      createdAt
    }
  }
`;
export const Register = (props) => {
  const [values, setValues] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, ___) => props.history.push('/login'),
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables: values });
  };

  const { email, username, password, confirmPassword } = values;
  return (
    <Fragment>
      <Row
        className='authform bg-white py-5 justify-content-center'
        style={{ opacity: '70%' }}
      >
        <Col sm={8} md={6} lg={4}>
          <h1 className='text-center'>Register</h1>
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
            <Form.Group>
              <Form.Label className={errors.confirmPassword && 'text-danger'}>
                {errors.confirmPassword ?? 'Confirm Password'}
              </Form.Label>
              <Form.Control
                type='password'
                value={confirmPassword}
                className={errors.confirmPassword && 'is-invalid'}
                onChange={(e) => {
                  setValues({ ...values, confirmPassword: e.target.value });
                }}
              />
            </Form.Group>
            <div className='text-center'>
              <Button variant='success' type='submit' disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </Button>
              <br />
              <small>
                Already have an account ? <Link to='/login'>Login</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};
