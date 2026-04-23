import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Importing my global Tailwind styles
import "./assets/styles/global.css";
import "sileo/styles.css";
import App from "./App.jsx";
import { Toaster } from "sileo";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" />
    <App />
  </StrictMode>,
);
