import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Mockup from "./pages/Mockup";
import Welcome from "./pages/Welcome";
import Join from "./pages/Join";
import Profile from "./pages/Profile";

import QRScanner from "./components/QRScanner";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { StyledEngineProvider } from "@mui/material/styles";
import { Global } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";

import { SnackbarProvider } from "notistack";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/mockup",
    element: <Mockup />,
  },
  {
    path: "/qr",
    element: <QRScanner />,
  },
]);

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
        <RouterProvider router={router} />
      </SnackbarProvider>
    </StyledEngineProvider>
  </StrictMode>
);
