import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

// MUI Stuff
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Scream extends Component {
  render() {
    const { classes, scream } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={scream.userImage}
          title="Profile Image"
          className={classes.image}
        />
        <CardContent class={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${scream.userHandle}`}
            color="primary"
          >
            {scream.userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {scream.createdAt}
          </Typography>
          <Typography variant="body1">{scream.body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Scream);