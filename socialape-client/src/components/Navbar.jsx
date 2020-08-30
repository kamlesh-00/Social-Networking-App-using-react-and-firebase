import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// MUI
import { Tooltip, IconButton } from "@material-ui/core";

//MUI Stuff
import { AppBar, Toolbar, Button } from "@material-ui/core";
import AddScreamIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated === true ? (
            <Fragment>
              <Tooltip title="Create a Scream">
                <IconButton>
                  <AddScreamIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Home">
                <IconButton>
                  <Link to="/">
                    <HomeIcon />
                  </Link>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
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
