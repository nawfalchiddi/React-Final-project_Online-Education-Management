import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Theprovider } from "./utils/Mycontext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Theprovider>
        <App />
      </Theprovider>
    </BrowserRouter>
  </StrictMode>
);