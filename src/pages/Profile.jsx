/* eslint-disable react/prop-types */
import { useState } from "react";
import { db } from "../firebase";
import { ref, get, set, update, push } from "firebase/database";
import useUserConnections from "../hooks/useUserConnections";
import { encodeUsername } from "../utils";

import QRScanner from "../components/QRScanner";

import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useDialog } from "../context/DialogContext";

import { IconButton, Skeleton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useSnackbar } from "notistack";

import QrScanner from "../components/icons/QrScanner";

import Tooltip from "@mui/material/Tooltip";

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

  const { enqueueSnackbar } = useSnackbar();

  const { connections, isLoading: isConnectionsLoading } = useUserConnections(
    user?.username
  );

  const { isLoading, setIsLoading } = useLoading();

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

      if (username === user.username) {
        setIsNotFound(true);
        openDialog({
          type: "error",
          title: "Invalid QR Code",
          content: "Bro, you can't connect with yourself.",
          onClose: () => {
            setIsNotFound(false);
            closeDialog();
          },
        });
        return;
      }

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
          confirmButtonLabel: "Yes",
          cancelButtonLabel: "No",
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

      const currentTimestamp = Date.now();

      await set(newConnectionRef, {
        id: newConnectionRef.key,
        user1: encodeUsername(user.username),
        user2: encodeUsername(userData?.username),
        timestamp: currentTimestamp,
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
        lastActive: currentTimestamp,
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
        lastActive: currentTimestamp,
      });

      enqueueSnackbar(`You are now connected with ${userData?.displayName}!`, {
        variant: "success",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-6">
      <div className="fixed top-2 right-2 flex justify-end">
        <IconButton
          sx={{
            width: 48,
            height: 48,
          }}
          onClick={toggleDrawer(true)}
        >
          <QrScanner />
        </IconButton>
      </div>

      <div className="flex flex-col items-center mt-[100px]">
        <img
          src={user.avatarUrl}
          alt="Profile"
          className="w-48 h-48 rounded-full shadow-lg mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
      </div>

      <div className="mt-8 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Connections
        </h2>

        {isConnectionsLoading ? (
          <div className="grid grid-cols-5 gap-4">
            {Array.from(new Array(10)).map((_, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shadow-md"
              >
                <Skeleton variant="circular" width={48} height={48} />
              </div>
            ))}
          </div>
        ) : connections.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {connections.map((connection) => (
              <Tooltip
                key={connection.username}
                title={connection.displayName}
                enterTouchDelay={0}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shadow-md">
                  <img
                    src={connection.avatarUrl}
                    alt={connection.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-left">
            <p>You haven&apos;t connected with anyone yet.</p>
            <p>Start meeting people to grow your network!</p>
          </div>
        )}
      </div>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
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
          <div
            style={{
              width: 48,
              height: 48,
            }}
          ></div>{" "}
          {/* Empty div to align the title */}
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
