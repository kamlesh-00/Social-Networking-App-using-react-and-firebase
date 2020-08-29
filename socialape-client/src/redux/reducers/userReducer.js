import {
    SET_USERS,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED
} from "../types";
import axios from 'axios';

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