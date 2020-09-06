import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// MUI Stuff
import { Button, Grid, TextField } from "@material-ui/core";

// Redux Stuff
import { connect } from "react-redux";
import { submitComment, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: "",
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
      this.setState({ errors: "" });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };

  render() {
    const { classes, authenticated } = this.props;
    const { body, errors } = this.state;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on Scream"
            error={errors.Comment ? true : false}
            helperText={errors.Comment}
            value={body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}>
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeperator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment, clearErrors })(
  withStyles(styles)(CommentForm)
);
