import React from "react";
import ReactDOM from "react-dom/client";
import MetrajApp from "./metrajapp"; // ✅ doğru dosya

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetrajApp />
  </React.StrictMode>
);
