import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { WorkflowProvider } from "./state/WorkflowContext.jsx";
import "../styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkflowProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </WorkflowProvider>
  </React.StrictMode>,
);
