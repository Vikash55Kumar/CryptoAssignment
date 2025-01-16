import { useEffect, useState } from 'react'
import {ToastContainer} from "react-toastify"
import Nav from './component/Navbar/Nav'
import { Foot } from './component/Footer/Foot'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './component/Home/Home';

import { useDispatch, useSelector } from 'react-redux';
import { getCryptoDetails, getTargetDetails } from './action/cryptoAction';
import CryptoList from './component/CryptoCurrency/CryptoList';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCryptoDetails());
    dispatch(getTargetDetails())
  }, [dispatch]);

  const {crypto} = useSelector((state) => state.crypto)
  const {cryptoTarget} = useSelector((state) => state.cryptoTarget)

  // console.log(cryptoTarget);
  
  return (
    <>
      <ToastContainer 
        position="top-center"  
        autoClose={3000}  // Toast will disappear after 4 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
          <Nav/>
          <Routes>
            <Route path="/" element={<CryptoList crypto={crypto} cryptoTarget={cryptoTarget?.data}/>} />
          </Routes>
          <Foot />
      </Router>
    </>
  );
}

export default App
