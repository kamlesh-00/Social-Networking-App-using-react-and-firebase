import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { Tooltip, IconButton } from "@material-ui/core";
// Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

export class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    )
      return true;
    else return false;
  };
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <Tooltip title="Like">
          <IconButton>
            <FavoriteBorder color="primary" />
          </IconButton>
        </Tooltip>
      </Link>
    ) : this.likedScream() ? (
      <Tooltip title="Undo Like">
        <IconButton onClick={this.unlikeScream}>
          <FavoriteIcon color="primary" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Like">
        <IconButton onClick={this.likeScream}>
          <FavoriteBorder color="primary" />
        </IconButton>
      </Tooltip>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
