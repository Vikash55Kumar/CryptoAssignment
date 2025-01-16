import { GET_CRYPTO_REQUEST, GET_CRYPTO_SUCCESS, GET_CRYPTO_FAIL, UPDATE_CRYPTO_TARGET_REQUEST, UPDATE_CRYPTO_TARGET_SUCCESS, UPDATE_CRYPTO_TARGET_FAIL, GET_TARGET_REQUEST, GET_TARGET_SUCCESS, GET_TARGET_FAIL} from "../constrants/ATSConstrants";
import { io } from "socket.io-client";
import axios from "axios"
const socket = io("http://localhost:4000");

export const getCryptoDetails = () => async (dispatch) => {
  try {
      dispatch({ type: GET_CRYPTO_REQUEST });

      socket.on("crypto_prices", (data) => {
        //   console.log("Response received:", data);
          dispatch({
              type: GET_CRYPTO_SUCCESS,
              payload: data,
          });
      });

      // Handle errors or disconnections
      socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
          dispatch({
              type: GET_CRYPTO_FAIL,
              payload: error.message,
          });
      });


  } catch (error) {
      console.error("Error:", error.message);
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      dispatch({
          type: GET_CRYPTO_FAIL,
          payload: error.response?.data?.message || error.message,
      });
  }
};

export const getTargetDetails = () => async (dispatch) => {
    try {
        dispatch({ type: GET_TARGET_REQUEST });
        
        const { data } = await axios.get("http://localhost:4000/api/v1/cryptos/getTargetDetails");
        // console.log('API response:', data);

        dispatch({ type: GET_TARGET_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
          type: GET_TARGET_FAIL,
          payload: error.response?.data?.message || error.message,
        });
      }
};

export const updateCryptoTarget = (cryptoData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CRYPTO_TARGET_REQUEST });
        console.log("data : ", cryptoData);
        
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post("http://localhost:4000/api/v1/cryptos/updateCryptoTarget", cryptoData, config);
    
        dispatch({ type: UPDATE_CRYPTO_TARGET_SUCCESS, payload: response.data });
        return response;

    } catch (error) {
        dispatch({ type: UPDATE_CRYPTO_TARGET_FAIL, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

