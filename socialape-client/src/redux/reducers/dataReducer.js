import {
    SET_SCREAM,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM
} from '../types';

const initialState = {
    screams: [],
    scream: {},
    loading: false
};

export default function (state = initialState, actions) {
    switch (actions.type) {
        case SET_SCREAM:
            return {
                ...state,
                screams: actions.payload,
                    loading: false
            };
        case UNLIKE_SCREAM:
            var index = state.screams.findIndex((scream) => scream.screamId === actions.payload.screamId);
            state.screams[index] = actions.payload;
            return {
                ...state
            };
        case LIKE_SCREAM:
            var index = state.screams.findIndex((scream) => scream.screamId === actions.payload.screamId);
            state.screams[index] = actions.payload;
            return {
                ...state
            };
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case DELETE_SCREAM:
            var index = state.screams.find((scream) => scream.screamId === actions.payload);
            state.screams.splice(index, 1);
            return {
                ...state
            };
        default:
            return state;
    }
}