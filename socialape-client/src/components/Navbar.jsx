import React, { Component } from "react";
import { Link } from "react-router-dom";

//MUI Stuff
import { AppBar, Toolbar, Button } from "@material-ui/core";

class Navbar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to={"/login"}>
            Login
          </Button>
          <Button color="inherit" component={Link} to={"/"}>
            Home
          </Button>
          <Button color="inherit" component={Link} to={"/signup"}>
            Signup
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
