import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Provider} from "react-redux";
import store from "./store";
import { NextUIProvider } from "@nextui-org/react";
import './index.css'
import "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NextUIProvider>
        <App />
    </NextUIProvider>
  </Provider>
);
