import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import DeleteScream from "./DeleteScream";

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
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

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
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.scream.screamId
      )
    ) {
      return true;
    } else return false;
  };

  unlikedScream;

  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId);
    this.render();
  };

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

    const likeButton = !authenticated ? (
      <Tooltip title="Like">
        <IconButton>
          <Link to="/login">
            <FavoriteBorderIcon color="primary" />
          </Link>
        </IconButton>
      </Tooltip>
    ) : this.likedScream() ? (
      <Tooltip title="Undo Like">
        <IconButton onClick={this.unlikeScream}>
          <FavoriteIcon color="primary" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Like">
        <IconButton onClick={this.likeScream}>
          <FavoriteBorderIcon color="primary" />
        </IconButton>
      </Tooltip>
    );

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
          {likeButton}
          <span>{scream.likeCount} Likes</span>
          <Tooltip title="Comments">
            <IconButton>
              <ChatIcon color="primary" />
            </IconButton>
          </Tooltip>
          <span>{scream.commentCount} Comments</span>
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Scream));
