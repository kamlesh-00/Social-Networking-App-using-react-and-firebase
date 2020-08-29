import {
  SET_USERS,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
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

export const signUpUser = (newUserData, history) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
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

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIDToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({
    type: SET_UNAUTHENTICATED
  });
}

export const getUserData = () => (dispatch) => {
  dispatch({
    type: LOADING_USER
  });
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

const setAuthorizationHeader = (token) => {
  const FBIDToken = `Bearer ${token}`;
  localStorage.setItem("FBIDToken", FBIDToken);
  axios.defaults.headers.common["Authorization"] = FBIDToken;
}