import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import store from "./redux/Store"; // Assuming you have a Redux store
import "./index.css"

// Render the App component
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    
      <App />
    
  </Provider>
);