import React from 'react';
import { useAuthState } from './context/authContext';
import { Redirect, Route } from 'react-router-dom';

const DynamicRoutes = (props) => {
  const { user } = useAuthState();

  if (props.authenticated && !user) {
    return <Redirect to='/login' />;
  } else if (props.guest && user) {
    return <Redirect to='/' />;
  } else return <Route component={props.component} {...props} />;
};

export default DynamicRoutes;
