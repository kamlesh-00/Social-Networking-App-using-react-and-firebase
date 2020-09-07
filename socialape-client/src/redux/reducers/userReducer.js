import {
  SET_USERS,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  UNLIKE_SCREAM,
  LIKE_SCREAM,
  MARK_NOTIFICATION_READ,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: [],
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...initialState,
      };
    case SET_USERS:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.userHandle,
            screamId: action.payload.screamId,
          },
        ],
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screamId !== action.payload.screamId
        ),
      };
    case MARK_NOTIFICATION_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
