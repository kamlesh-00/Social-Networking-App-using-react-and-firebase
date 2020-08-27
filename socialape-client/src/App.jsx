import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";

//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
//Components
import Navbar from "./components/Navbar";

//Util
import themeFile from "./util/theme";
import AuthRoute from "./util/authRoute";

const theme = createTheme(themeFile);

let authenticated = false;
const token = localStorage.getItem("FBIDToken");
if (token !== null) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
    window.location.href = "/login";
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute
                  exact
                  path="/login"
                  component={Login}
                  authenticated
                />
                <AuthRoute
                  exact
                  path="/signup"
                  component={SignUp}
                  authenticated
                />
                <Redirect to="/" />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
