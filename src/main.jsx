import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Mockup from "./pages/Mockup";
import Welcome from "./pages/Welcome";
import Join from "./pages/Join";
import Profile from "./pages/Profile";

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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
