import React, { Component, Fragment } from "react";
import Proptypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

//MUI Stuff
import {
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";

import LocationOnIcon from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
  paper: {
    padding: 20,
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%",
      },
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
      },
      "& a": {
        color: theme.palette.primary.main,
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
});

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageURL, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageURL} alt="Profile" className="profile-image" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <Tooltip title="Upload image" placement="top">
                <IconButton onClick={this.handleEditPicture} className="button">
                  {" "}
                  <EditIcon color="primary" />{" "}
                </IconButton>
              </Tooltip>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5">
                @{handle}
                {<hr />}
              </MuiLink>
              {bio ? <Typography variant="body2">{bio}</Typography> : null}
              {location && (
                <Fragment>
                  <LocationOnIcon color="primary" /> <span>{location}</span>
                  <hr />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />{" "}
                  <a href={website} target="_blank">
                    {" "}
                    {website}
                    {<hr />}
                  </a>
                </Fragment>
              )}
              <CalendarTodayIcon color="primary" />{" "}
              <span>
                Joined {dayjs(createdAt).format("MM YYYY")}
                {<hr />}
              </span>
            </div>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No Profile found, please login again!!
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login">
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup">
              Sign Up
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <p>Loading....</p>
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

Profile.proptype = {
  classes: Proptypes.object.isRequired,
  user: Proptypes.object.isRequired,
  logoutUser: Proptypes.func.isRequired,
  uploadImage: Proptypes.func.isRequired,
};

const mapActionToProps = {
  logoutUser,
  uploadImage,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(Profile));
