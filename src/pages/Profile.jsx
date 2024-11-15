/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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

import Button from "../components/core/Button";
import { IconButton, Skeleton } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useSnackbar } from "notistack";

import QrScanner from "../components/icons/QrScanner";

import Tooltip from "@mui/material/Tooltip";
import DialogPostcard from "./DialogPostcard";

const drawerBleeding = 56;

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

//
const getRankingIconSize = (index) => {
  switch (index) {
    case 0:
      return "w-14";
    case 1:
      return "w-12";
    case 2:
      return "w-10";
    default:
      return "w-10";
  }
};
const getRankingIcon = (index) => {
  switch (index) {
    case 0:
      return "rank/nads.png";
    case 1:
      return "rank/gold.png";
    case 2:
      return "rank/silver.png";
    default:
      return "rank/bronze.png";
  }
};

const getRankingTextSize = (length) => {
  switch (length) {
    case 1:
      return "text-[24px]";
    case 2:
      return "text-[20px]";
    case 3:
      return "text-[14px]";
    default:
      return "text-lg";
  }
};

const Profile = (props) => {
  const { user } = useAuth();
  const { openDialog, closeDialog } = useDialog();

  const { enqueueSnackbar } = useSnackbar();

  const {
    connections,
    rank,
    isLoading: isConnectionsLoading,
  } = useUserConnections(user?.username);
  const [isAvailableToDownloadPostcard, setIsAvailableToDownloadPostcard] =
    useState(false);

  const { isLoading, setIsLoading } = useLoading();

  const [open, setOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchAvailableToDownloadPostcard = async () => {
      const availableToDownloadPostcardRef = ref(
        db,
        "config/availableToDownloadPostcard"
      );
      const availableToDownloadPostcardSnapshot = await get(
        availableToDownloadPostcardRef
      );
      setIsAvailableToDownloadPostcard(
        availableToDownloadPostcardSnapshot.val()
      );
    };

    fetchAvailableToDownloadPostcard();
  }, []);

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
        if (!userData.displayName || !userData.avatarUrl) {
          setIsNotFound(true);
          openDialog({
            type: "error",
            title: "User data incomplete",
            content: `Please ask ${userData?.username} to update their profile.`,
            onClose: () => {
              setIsNotFound(false);
              closeDialog();
            },
          });
          return;
        }

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

      // Check if connections are enabled
      const connectionsEnabledRef = ref(db, "config/connectionsEnabled");
      const connectionsEnabledSnapshot = await get(connectionsEnabledRef);
      const connectionsEnabled = connectionsEnabledSnapshot.val();

      if (!connectionsEnabled) {
        openDialog({
          type: "error",
          title: "Connections Disabled",
          content: "Connections cannot be made at this time.",
        });
        setIsLoading(false);
        return;
      }

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
        [encodeUsername(userData?.username)]: {
          timestamp: currentTimestamp,
        },
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
        [encodeUsername(user.username)]: {
          timestamp: currentTimestamp,
        },
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
        <div className="relative mb-4">
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-48 h-48 rounded-full shadow-lg"
          />
          {/* {rank > 0 && (
            <span className="absolute bottom-1 right-1 h-8 w-10 font-bold border-2 border-gray-300 rounded-full p-2 flex justify-center items-center bg-white">
              {rank}
            </span>
          )} */}
          {rank > 0 && (
            <div className="absolute bottom-0 right-0 w-[56px] flex justify-center items-center mr-2 shrink-0">
              <img
                src={getRankingIcon(rank - 1)}
                alt="bronze"
                className={`z-[1] ${getRankingIconSize(rank - 1)}`}
              />
              <span
                className={`absolute text-white font-bold z-[2] ${getRankingTextSize(
                  String(rank).length
                )}`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform:
                    rank - 1 < 3
                      ? "translate(-50%, -60%)"
                      : "translate(-50%, -50%)",
                }}
              >
                {rank}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Connections ({connections.length})
          </h2>
          <Button
            variant="contained"
            startIcon={<MailOutlineIcon />}
            onClick={() => {
              if (!isAvailableToDownloadPostcard) {
                openDialog({
                  type: "error",
                  title: "Postcard not available",
                  content:
                    "Digital postcard will be available in 2-3 days after the event",
                });
              } else {
                if (connections.length === 0) {
                  openDialog({
                    type: "error",
                    title: "No connections",
                    content:
                      "You need to connect with someone to get a postcard",
                  });
                  return;
                }

                const data = {
                  total: connections.length,
                  rank,
                  displayName: user.displayName,
                  avatarUrl: `${user.avatarUrl}&v=${new Date().getTime()}`,
                  connections: connections.map((connection) => ({
                    displayName: connection.displayName,
                    avatarUrl: `${
                      connection.avatarUrl
                    }&v=${new Date().getTime()}`,
                  })),
                };

                openDialog({
                  type: "custom",
                  customDialog: (
                    <DialogPostcard
                      data={data}
                      onClose={() => {
                        closeDialog();
                      }}
                    />
                  ),
                });
              }
            }}
            disabled={isLoading}
          >
            Get postcard!
          </Button>
        </div>

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
