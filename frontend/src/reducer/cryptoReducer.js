import {

 GET_CRYPTO_FAIL,
 GET_CRYPTO_REQUEST,
 GET_CRYPTO_SUCCESS,
 GET_TARGET_FAIL,
 GET_TARGET_REQUEST,
 GET_TARGET_SUCCESS,

}  from "../constrants/ATSConstrants.js"

export const cryptoReducer = (state = {crypto : []}, action) => {
    switch (action.type) {

        case GET_CRYPTO_REQUEST:
            return {
                ...state,
                loading : true,
                crypto : []
            }
        
        case GET_CRYPTO_SUCCESS:
            return {
                ...state,
                loading : false,
                crypto : action.payload
            }
        
        case GET_CRYPTO_FAIL:
            return {
                ...state,
                loading : false,
                crypto : null,
                error : action.payload
        }
    
        default:
            return state;
    }
}

export const targetReducer = (state = {cryptoTarget : []}, action) => {
    switch (action.type) {

        case GET_TARGET_REQUEST:
            return {
                ...state,
                loading : true,
                cryptoTarget : []
            }
        
        case GET_TARGET_SUCCESS:
            return {
                ...state,
                loading : false,
                cryptoTarget : action.payload
            }
        
        case GET_TARGET_FAIL:
            return {
                ...state,
                loading : false,
                cryptoTarget : null,
                error : action.payload
        }
    
        default:
            return state;
    }
}
