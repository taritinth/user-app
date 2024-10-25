import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import useUserConnections from "../hooks/useUserConnections";
import { encodeUsername } from "../utils";

import QRScanner from "../components/QRScanner";

import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useSnackbar } from "notistack";
import { useDialog } from "../context/DialogContext";

import Loading from "../components/Loading";
import ReactDOM from "react-dom";

const drawerBleeding = 56;

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

//

const Profile = (props) => {
  const { openDialog, closeDialog } = useDialog();

  const { enqueueSnackbar } = useSnackbar();
  let connections = useUserConnections("dos4289");

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const { window } = props;

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned data", data);
      const username = data.split("u/").pop();
      findUser(username);
    }
  };

  const findUser = async (username) => {
    try {
      setIsLoading(true);
      const userRef = ref(db, `users/${encodeUsername(username)}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      console.log("userData", userData);

      // Close QR Scanner & Open confirmation dialog
      if (userData) {
        toggleDrawer(false)();
        openDialog({
          type: "confirm",
          title: `Would you like to connect with ${username}?`,
          onConfirm: () => {
            // createConnection(username);
            closeDialog();
          },
        });
      } else {
        setIsNotFound(true);
        openDialog({
          type: "error",
          title: "User not found",
          content: `The user ${username} is not found.`,
          onClose: () => {
            setIsNotFound(false);
            closeDialog();
          },
        });
      }
    } catch (error) {
      console.error("Error finding user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createConnection = async (username) => {
    const connectionsRef = ref("connections");
    const newConnectionRef = connectionsRef.push();

    const isConnected = user?.connections?.[username];

    if (!isConnected) {
      await set(newConnectionRef, {
        id: newConnectionRef.key,
        user1: encodeUsername(user.username),
        user2: encodeUsername(username),
        timestamp: Date.now(),
      });

      const userConnectionsRef = ref(
        db,
        `users/${encodeUsername(user.username)}/connections`
      );
      await update(userConnectionsRef, {
        [encodeUsername(username)]: true,
      });
      const userRef = ref(db, `users/${encodeUsername(user.username)}`);
      await update(userRef, {
        lastActive: Date.now(),
      });

      const otherUserConnectionsRef = ref(
        db,
        `users/${encodeUsername(username)}/connections`
      );
      await update(otherUserConnectionsRef, {
        [encodeUsername(user.username)]: true,
      });
      const otherUserRef = ref(db, `users/${encodeUsername(username)}`);
      await update(otherUserRef, {
        lastActive: Date.now(),
      });
    }
  };

  const fetchUserInfo = async (username) => {
    const userRef = ref(db, `users/${encodeUsername(username)}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    setUser(userData);
  };

  useEffect(() => {
    fetchUserInfo("dos4289");
  }, []);

  return (
    <div>
      Profile
      {isLoading &&
        ReactDOM.createPortal(
          <Loading />,
          document.getElementById("custom-root") // Ensure this div exists in your HTML
        )}
      <Box sx={{ textAlign: "center", pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
        {/* <Button
          onClick={() =>
            enqueueSnackbar("Hello, world!", {
              variant: "success",
            })
          }
        >
          Snackbar
        </Button> */}
      </Box>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: false, // Better open performance on mobile.
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            Scan QR Code
          </Typography>
        </StyledBox>
        <QRScanner
          validResultFormat="https://nads-meet-nads.vercel.app/u/"
          isNotFound={isNotFound}
          isLoading={isLoading}
          onScan={handleScan}
        />
      </SwipeableDrawer>
    </div>
  );
};

export default Profile;
