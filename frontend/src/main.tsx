import { ThemeModeProvider } from "./themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import theme from "./themes";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/store.ts";

// Import i18n configuration
import "./i18n";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <ToastContainer />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
