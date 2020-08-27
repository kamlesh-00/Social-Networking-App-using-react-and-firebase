import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

import Scream from "../components/Scream";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screams: null,
    };
  }

  componentDidMount() {
    axios
      .get("/screams")
      .then((res) => {
        this.setState({
          screams: res.data,
        });
      })
      .catch((err) => console.log("Error: " + err));
  }

  render() {
    let recentScreamsMarkup =
      this.state.screams !== null ? (
        this.state.screams.map((scream) => <Scream scream={scream} key={scream.screamId} />)
      ) : (
          <p>Loading....</p>
        );
    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Content</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
