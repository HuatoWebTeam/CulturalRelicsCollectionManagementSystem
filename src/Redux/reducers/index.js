

import { combineReducers } from 'redux';
import Cookie from 'js-cookie';

import {
  EXHIBITIONPAGE,
  REPAIRPAGE,
  COLLECINFO,
  COLLECINFOPAGE,
  BILLPAGE,
  PUTINSTORAGEPAGE,
  OUTBOUNDPAGE,
  INVENTORYPAGE,
  SOLICITIONPAGE,
  WAREHOUSEPAGE,
  TANKINFOPAGE,
  OPERATIONPAGE,
  AUTHORITYSTATE,
  REPAIRMETHODPAGE
} from "../actions";

export let initialState = {
    login: {
        token: () => {
            return Cookie.getJSON('UserInfo').Token;
        }
    },
    main:{
        buttonText: '默认',
        exhibitionPage: 1,
        repairPage: 1,
        collectionInfoData:{      // 信息登记 编辑
            state: null,
            formData: []
        },
        dateFormat: 'YYYY-MM-DD',     // 格式化时间格式
        collecInfoPage: 1,
        billPage: 1,
        putInPage: 1,
        outboundPage: 1,
        inventoryPage: 1,
        solicitionPage: 1,
        warehousePage:1,
        tankInfoPage: 1,
        operationPage: 1,
        repairMethodPage: 1,
        authorityState: null  // 是否能操作审批
    }
};

let reducers = combineReducers({
    main: (state = {}, action) => {
        switch (action.type) {
            case EXHIBITIONPAGE: 
                return {...state, exhibitionPage: action.payload };
            case REPAIRPAGE: 
                return {...state, repairPage: action.payload };
            case COLLECINFO: 
                return { 
                    ...state, 
                    collectionInfoData: { 
                        state: action.payload.state, 
                        formData: action.payload.formData 
                    } 
                };
            case COLLECINFOPAGE: 
                return { ...state, collecInfoPage: action.payload};
            case BILLPAGE: 
                return {...state, billPage: action.payload }
            case PUTINSTORAGEPAGE: 
                return {...state, putInPage: action.payload}
            case OUTBOUNDPAGE: 
                return {...state, outboundPage: action.payload}
            case INVENTORYPAGE: 
                return {...state, inventoryPage: action.payload}
            case SOLICITIONPAGE: 
                return {...state, solicitionPage: action.payload}
            case WAREHOUSEPAGE:
                return {...state, warehousePage: action.payload}
            case TANKINFOPAGE: 
                return {...state, tankInfoPage: action.payload}
            case OPERATIONPAGE:
                return {...state, operationPage: action.payload}
            case AUTHORITYSTATE:
                return {...state, authorityState: action.payload}
            case REPAIRMETHODPAGE: 
                return { ...state, repairMethodPage: action.payload}
            default:
                return state;
        }
    },
    login: ( state ) => {
        return {...state};
    }
})


export default reducers;