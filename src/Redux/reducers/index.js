

import { combineReducers } from 'redux';
import Cookie from 'js-cookie';

import { CLICK_ME } from '../actions';

export let initialState = {
    login: {
        token: () => {
            return Cookie.getJSON('UserInfo').Token;
        }
    },
    main:{
        buttonText: '默认',
        
    }
};

let reducers = combineReducers({
    main: (state = {}, action) => {
        switch (action.type) {
            case CLICK_ME:
                return {...state, buttonText: action.payload};
        
            default:
                return state;
        }
    },
    login: ( state ) => {
        return {...state};
    }
})


export default reducers;