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
    <div>
      {!isLoading &&
        (user ? (
          <div>
            <h1>{user.displayName}</h1>
            <Button variant="contained" onClick={handleSignIn}>
              Join
            </Button>
          </div>
        ) : (
          <div>Not found</div>
        ))}
    </div>
  );
};

export default User;
