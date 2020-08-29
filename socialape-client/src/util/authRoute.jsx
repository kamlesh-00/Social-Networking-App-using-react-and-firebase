import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

AuthRoute.prototype = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AuthRoute);
