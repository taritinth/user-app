import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Mockup from "./pages/Mockup";
import Welcome from "./pages/Welcome";
import Join from "./pages/Join";
import Profile from "./pages/Profile";
import Scanner from "./pages/Scanner";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/scanner",
    element: <Scanner />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
