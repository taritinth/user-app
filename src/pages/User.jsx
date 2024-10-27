import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { encodeUsername } from "../utils";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useDialog } from "../context/DialogContext";
import { Button } from "@mui/material";

const User = () => {
  const { openDialog, closeDialog } = useDialog();

  const { username } = useParams();
  const { isLoading, setIsLoading } = useLoading();

  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [user, setUser] = useState(null);

  const findUser = async (username) => {
    try {
      setIsLoading(true);

      const userRef = ref(db, `users/${encodeUsername(username)}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      console.log("userData", userData);

      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error finding user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    openDialog({
      type: "confirm",
      title: `Would you like to join the activity as ${user.displayName}?`,
      onConfirm: async () => {
        closeDialog();

        setIsLoading(true);
        await signIn(username);
        setIsLoading(false);

        navigate("/profile");
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    if (!username) return;
    findUser(username);
  }, [username]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      {!isLoading &&
        (user ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              👋 Welcome, {user?.displayName}!
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;re excited to have you join us, {user?.displayName}! Ready
              to dive in?
            </p>

            <p className="text-gray-500 mb-6">
              Your profile is set up and looking great! When you&apos;re ready,
              just hit the button below to start connecting with the community.
            </p>

            <button
              onClick={handleSignIn}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Let&apos;s Go!
            </button>
            {/* <h1>{user.displayName}</h1>
            <Button variant="contained" onClick={handleSignIn}>
              Join
            </Button> */}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              User Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              Oops! We couldn&apos;t locate the profile you&apos;re looking for.
            </p>

            <p className="text-gray-500 mb-6">
              It might be a typo in the link, or the user profile doesn&apos;t
              exist. Please double-check or try again.
            </p>
          </div>
        ))}
    </div>
  );
};

export default User;
