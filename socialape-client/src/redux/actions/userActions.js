import {
  SET_USERS,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED
} from "../types";
import axios from "axios";
import {
  Redirect
} from "react-router-dom";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .post("/login", userData)
    .then((res) => {
      const FBIDToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIDToken", FBIDToken);
      axios.defaults.headers.common["Authorization"] = FBIDToken;
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS,
      });
      dispatch({
        type: SET_AUTHENTICATED,
      });
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = () => (dispatch) => {
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};