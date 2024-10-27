import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { encodeUsername } from "../utils";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useDialog } from "../context/DialogContext";
import Button from "../components/core/Button";

import Container from "../components/core/Container";

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
      title: `Are you sure this is your profile, ${user?.displayName}?`,
      onConfirm: async () => {
        closeDialog();

        setIsLoading(true);
        await signIn(username);
        setIsLoading(false);

        navigate("/profile");
        window.location.reload();
      },
      confirmButtonLabel: "Yes, It's Me",
      cancelButtonLabel: "No",
    });
  };

  useEffect(() => {
    if (!username) return;
    findUser(username);
  }, [username]);

  return (
    <Container>
      {!isLoading &&
        (user ? (
          <div className="flex flex-col items-center">
            <img
              src={user?.avatarUrl}
              alt="User Profile Picture"
              className="w-48 h-48 rounded-full mb-6"
            />

            <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
              👋 Welcome, {user?.displayName}!
            </h1>

            <p className="text-center text-gray-600 mb-6 max-w-xs">
              We&apos;re excited to have you join us! Ready to dive in?
            </p>

            <p className="text-center text-gray-500 mb-6 max-w-xs">
              Your profile is set up and looking great! When you&apos;re ready,
              just hit the button below to start connecting with the community.
            </p>

            <Button
              sx={{
                mt: 2,
              }}
              variant="contained"
              size="large"
              onClick={handleSignIn}
            >
              Let&apos;s Go!
            </Button>
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
    </Container>
  );
};

export default User;
