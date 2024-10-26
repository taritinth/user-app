/* eslint-disable react/prop-types */
import { useState } from "react";
import { db } from "../firebase";
import { ref, get, set, update, push } from "firebase/database";
import useUserConnections from "../hooks/useUserConnections";
import { encodeUsername } from "../utils";

import QRScanner from "../components/QRScanner";

import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useDialog } from "../context/DialogContext";

import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";

const drawerBleeding = 56;

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

//

const Profile = (props) => {
  const { user } = useAuth();
  const { openDialog, closeDialog } = useDialog();

  const { connections, isLoading: isConnectionsLoading } = useUserConnections(
    user?.username
  );

  const { isLoading, setIsLoading } = useLoading();

  console.log("connections", connections);

  // const [user, setUser] = useState(null);

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
          title: `Would you like to connect with ${userData.displayName}?`,
          onConfirm: () => {
            createConnection(userData);
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

  const createConnection = async (userData) => {
    try {
      setIsLoading(true);

      const userConnectedRef = ref(
        db,
        `users/${encodeUsername(user.username)}/connections/${encodeUsername(
          userData?.username
        )}`
      );
      const userConnectedSnapshot = await get(userConnectedRef);
      const userConnectedData = userConnectedSnapshot.val();

      if (userConnectedData) {
        console.log("Connection already exists");
        openDialog({
          type: "error",
          title: "Connection already exists",
          content: `You are already connected with ${userData?.displayName}.`,
        });
        setIsLoading(false);
        return;
      }

      const connectionsRef = ref(db, "connections");
      const newConnectionRef = push(connectionsRef);

      await set(newConnectionRef, {
        id: newConnectionRef.key,
        user1: encodeUsername(user.username),
        user2: encodeUsername(userData?.username),
        timestamp: Date.now(),
      });

      const userConnectionsRef = ref(
        db,
        `users/${encodeUsername(user.username)}/connections`
      );
      await update(userConnectionsRef, {
        [encodeUsername(userData?.username)]: true,
      });
      const userRef = ref(db, `users/${encodeUsername(user.username)}`);
      await update(userRef, {
        lastActive: Date.now(),
      });

      const otherUserConnectionsRef = ref(
        db,
        `users/${encodeUsername(userData?.username)}/connections`
      );
      await update(otherUserConnectionsRef, {
        [encodeUsername(user.username)]: true,
      });
      const otherUserRef = ref(
        db,
        `users/${encodeUsername(userData?.username)}`
      );
      await update(otherUserRef, {
        lastActive: Date.now(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ textAlign: "center", pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box>
      {user?.username}
      {isConnectionsLoading ? (
        <div>Loading connections...</div>
      ) : (
        <div>
          {connections.map((user, index) => (
            <div key={index}>{user.displayName}</div>
          ))}
        </div>
      )}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div> {/* Empty div to align the title */}
          <Typography sx={{ p: 2, color: "text.secondary", fontWeight: 500 }}>
            Scan QR Code
          </Typography>
          <IconButton
            sx={{
              width: 48,
              height: 48,
            }}
            onClick={toggleDrawer(false)}
          >
            <Close />
          </IconButton>
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
