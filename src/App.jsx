import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Mockup from "./pages/Mockup";
import Profile from "./pages/Profile";
import User from "./pages/User";
import NotFound from "./pages/NotFound"; // Import the NotFound component

import DialogProvider from "./context/DialogContext";
import LoadingProvider from "./context/LoadingContext";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  const router = createBrowserRouter([
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
    {
      path: "*", // This will match any route that is not defined above
      element: <NotFound />, // Render the NotFound component
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
