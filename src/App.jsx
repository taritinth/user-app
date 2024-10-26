import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Mockup from "./pages/Mockup";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";
import User from "./pages/User";

import DialogProvider from "./context/DialogContext";
import LoadingProvider from "./context/LoadingContext";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute isAllowed={user}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/mockup",
      element: (
        <ProtectedRoute isAllowed={user?.username === "0xh3x"}>
          <Mockup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/u/:username",
      element: <User />,
    },
  ]);

  return (
    <>
      <LoadingProvider>
        <DialogProvider>
          <RouterProvider router={router} />
        </DialogProvider>
      </LoadingProvider>
    </>
  );
};

export default App;
