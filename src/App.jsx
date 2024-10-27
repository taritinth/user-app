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
        <ProtectedRoute isAllowed={true}>
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
          <div className="min-h-screen flex flex-col">
            <RouterProvider router={router} />
          </div>
        </DialogProvider>
      </LoadingProvider>
    </>
  );
};

export default App;
