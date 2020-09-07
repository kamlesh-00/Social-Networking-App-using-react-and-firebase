import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import PostScream from "../scream/PostScream";
import Notifications from "./Notifications";

// Redux
import { connect } from "react-redux";

// MUI
import { Tooltip, IconButton } from "@material-ui/core";

//MUI Stuff
import { AppBar, Toolbar, Button } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated === true ? (
            <Fragment>
              <PostScream />
              <Tooltip title="Home">
                <IconButton>
                  <Link to="/">
                    <HomeIcon />
                  </Link>
                </IconButton>
              </Tooltip>
              <Notifications />
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to={"/login"}>
                Login
              </Button>
              <Button color="inherit" component={Link} to={"/"}>
                Home
              </Button>
              <Button color="inherit" component={Link} to={"/signup"}>
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Navbar);
