import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    POST_SCREAM,
    STOP_LOADING_UI,
    SET_SCREAM
} from '../types';

const initialState = {
    screams: [],
    scream: {},
    loading: false
};

export default function (state = initialState, actions) {
    switch (actions.type) {
        case SET_SCREAMS:
            return {
                ...state,
                screams: actions.payload,
                    loading: false
            };
        case UNLIKE_SCREAM:
            var index = state.screams.findIndex((scream) => scream.screamId === actions.payload.screamId);
            state.screams[index] = actions.payload;
            if (state.scream.screamId === actions.payload.screamId) {
                state.scream = actions.payload;
            }
            return {
                ...state
            };
        case LIKE_SCREAM:
            index = state.screams.findIndex((scream) => scream.screamId === actions.payload.screamId);
            state.screams[index] = actions.payload;
            if (state.scream.screamId === actions.payload.screamId) {
                state.scream = actions.payload;
            }
            return {
                ...state
            };
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case DELETE_SCREAM:
            index = state.screams.find((scream) => scream.screamId === actions.payload);
            state.screams.splice(index, 1);
            return {
                ...state
            };
        case POST_SCREAM:
            console.log(actions.payload);
            return {
                ...state,
                screams: [
                    actions.payload,
                    ...state.screams
                ]
            };
        case STOP_LOADING_UI:
            return {
                ...state,
                loading: false
            };
        case SET_SCREAM:
            return {
                ...state,
                scream: actions.payload
            }
            default:
                return state;
    }
}