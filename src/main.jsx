import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { StyledEngineProvider } from "@mui/material/styles";
import { Global } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";

import { SnackbarProvider } from "notistack";
import AuthProvider from "./context/AuthContext";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(100% - 100px)`,
            overflow: "visible",
          },
        }}
      />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </StyledEngineProvider>
  </StrictMode>
);
