import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      component={() =>
        authenticated === true ? <Redirect to="/" /> : <Component {...rest} />
      }
    />
  );
};

export default AuthRoute;
