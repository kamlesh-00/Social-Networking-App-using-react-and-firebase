import {
    SET_USERS,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED
} from "../types";

const initialState = {
    authenticated: false,
    credentials: [],
    likes: [],
    notifications: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return {
                ...initialState
            };
        case SET_USERS:
            return {
                authenticated: true,
                    ...action.payload
            };
        default:
            return state;
    }

}