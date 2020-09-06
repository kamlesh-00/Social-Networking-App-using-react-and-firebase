import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";

// MUI Stuff
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";

import { connect } from "react-redux";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Scream extends Component {
  render() {
    const {
      classes,
      scream,
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const deleteButton =
      authenticated && handle === scream.userHandle ? (
        <DeleteScream screamId={scream.screamId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={scream.userImage}
          title="Profile Image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          {deleteButton}
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${scream.userHandle}`}
            color="primary">
            {scream.userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(scream.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{scream.body}</Typography>
          <LikeButton screamId={scream.screamId} />
          <span>{scream.likeCount} Likes</span>
          <Tooltip title="Comments">
            <IconButton>
              <ChatIcon color="primary" />
            </IconButton>
          </Tooltip>
          <span>{scream.commentCount} Comments</span>
          <ScreamDialog
            screamId={scream.screamId}
            userHandle={scream.userHandle}
          />
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
