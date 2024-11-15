import { ref, set, push, get, update, onValue } from "firebase/database";
import { db, storage } from "../firebase";
import { encodeUsername } from "../utils";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import Button from "../components/core/Button";
import Container from "../components/core/Container";
import { Stack, Switch, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDialog } from "../context/DialogContext";
import { Red } from "../styles/color";
import DialogPostcard from "./DialogPostcard";

function Mockup() {
  const { openDialog, closeDialog } = useDialog();

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionEnabled, setIsConnectionEnabled] = useState(false); // State to hold connection status
  const [isAvailableToDownloadPostcard, setIsAvailableToDownloadPostcard] =
    useState(false);
  const [isGuestRegistrationEnabled, setIsGuestRegistrationEnabled] =
    useState(false);

  const [guestStart, setGuestStart] = useState(1);
  const [guestEnd, setGuestEnd] = useState(96);

  const [users, setUsers] = useState({});

  function getUsers() {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val() || {};
      setUsers(users);
    });
  }

  const sortedUsersByRanking = Object.values(users)
    .filter((user) => Object.keys(user?.connections || {}).length > 0)
    .sort((a, b) => {
      // Sort by number of connections (descending)
      const connectionDiff =
        Object.keys(b.connections).length - Object.keys(a.connections).length;

      if (connectionDiff !== 0) {
        return connectionDiff;
      }

      // If number of connections is the same, sort by last active (ascending)
      return a.lastActive - b.lastActive;
    });

  useEffect(() => {
    getUsers();
  }, []);

  const toggleGuestRegistration = async () => {
    try {
      setIsLoading(true);
      const guestRegistrationRef = ref(db, "config/guestRegistrationEnabled");
      await set(guestRegistrationRef, !isGuestRegistrationEnabled);
      setIsGuestRegistrationEnabled(!isGuestRegistrationEnabled);
      enqueueSnackbar(
        `Guest registration ${
          !isGuestRegistrationEnabled ? "enabled" : "disabled"
        }.`,
        {
          variant: "success",
        }
      );
    } catch (error) {
      console.error("Error toggling guest registration status: ", error);
      enqueueSnackbar("Error toggling guest registration status.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGuestRegistrationStatus = async () => {
      setIsLoading(true);

      const guestRegistrationRef = ref(db, "config/guestRegistrationEnabled");
      const guestRegistrationSnapshot = await get(guestRegistrationRef);
      setIsGuestRegistrationEnabled(guestRegistrationSnapshot.val());
      setIsLoading(false);
    };

    fetchGuestRegistrationStatus();
  }, []);

  // Fetch connection status when component mounts
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      setIsLoading(true);
      const connectionsEnabledRef = ref(db, "config/connectionsEnabled");
      const connectionsEnabledSnapshot = await get(connectionsEnabledRef);
      setIsConnectionEnabled(connectionsEnabledSnapshot.val());
      setIsLoading(false);
    };

    fetchConnectionStatus();
  }, []);

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

  // Function to toggle connection status
  const toggleConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const connectionsEnabledRef = ref(db, "config/connectionsEnabled");
      await set(connectionsEnabledRef, !isConnectionEnabled);
      setIsConnectionEnabled(!isConnectionEnabled);
      enqueueSnackbar(
        `Connections ${!isConnectionEnabled ? "enabled" : "disabled"}.`,
        {
          variant: "success",
        }
      );
    } catch (error) {
      console.error("Error toggling connection status: ", error);
      enqueueSnackbar("Error toggling connection status.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailableToDownloadPostcard = async () => {
    try {
      setIsLoading(true);
      const availableToDownloadPostcardRef = ref(
        db,
        "config/availableToDownloadPostcard"
      );
      await set(availableToDownloadPostcardRef, !isAvailableToDownloadPostcard);
      setIsAvailableToDownloadPostcard(!isAvailableToDownloadPostcard);
      enqueueSnackbar(
        `Available to download postcard ${
          !isAvailableToDownloadPostcard ? "enabled" : "disabled"
        }.`,
        {
          variant: "success",
        }
      );
    } catch (error) {
      console.error(
        "Error toggling available to download postcard status: ",
        error
      );
      enqueueSnackbar("Error toggling available to download postcard status.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConnections = async () => {
    try {
      setIsLoading(true);

      const connectionsRef = ref(db, "connections");
      await set(connectionsRef, {});
      console.log("Connections cleared.");

      // Clear node positions
      const nodesRef = ref(db, "nodePositions");
      await set(nodesRef, {});
      console.log("Node positions cleared.");

      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val();

      for (const userKey in users) {
        const userConnectionsRef = ref(db, `users/${userKey}/connections`);
        await set(userConnectionsRef, {});
        console.log(`Connections for ${userKey} cleared.`);
      }

      enqueueSnackbar("Connections cleared successfully.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error clearing connections: ", error);
      enqueueSnackbar("Error clearing connections.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add guests to the database e.g. guest1, guest2, etc.
  const addGuestsToDatabase = async (from, to) => {
    for (let i = from; i <= to; i++) {
      const username = `guest${i?.toString()?.padStart(3, "0")}`;
      // const displayName = `Guest ${i}`;
      // const avatarUrl =
      //   "https://pbs.twimg.com/profile_images/1810039515408678912/HIJv16jG_400x400.jpg";

      try {
        setIsLoading(true);

        // const uniqueFileName = `${encodeUsername(username)}.webp`;

        // const avatarStorageRef = storageRef(
        //   storage,
        //   `avatars/${uniqueFileName}`
        // );
        // const avatarResponse = await fetch(avatarUrl);
        // const avatarBlob = await avatarResponse.blob();

        // await uploadBytes(avatarStorageRef, avatarBlob, {
        //   cacheControl: "public,max-age=31536000",
        // });

        // const avatarDownloadUrl = await getDownloadURL(avatarStorageRef);

        const usersRef = ref(db, `users/${encodeUsername(username)}`);

        await set(usersRef, {
          userId: uuidv4(),
          username,
          displayName: "",
          avatarUrl: "",
          connections: {},
          lastActive: Date.now(),
        });

        console.log(`User ${username} added successfully with avatar.`);

        enqueueSnackbar(`User ${username} added successfully with avatar.`, {
          variant: "success",
        });
      } catch (error) {
        console.error("Error adding user: ", error);
        enqueueSnackbar(`Error adding user: ${username}.`, {
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to upload avatars to Firebase Storage and add users to Firebase Database
  // const addUsersToDatabase = async () => {
  //   for (const user of users) {
  //     try {
  //       // Generate a unique filename using uuid for the avatar
  //       const uniqueFileName = `${encodeUsername(user.username)}.webp`;

  //       // Upload the avatar image to Firebase Storage
  //       const avatarStorageRef = storageRef(
  //         storage,
  //         `avatars/${uniqueFileName}`
  //       );
  //       const avatarResponse = await fetch(user.avatarUrl); // Fetch the image from the original URL
  //       const avatarBlob = await avatarResponse.blob(); // Convert the image to a blob

  //       // Upload avatar blob to Firebase Storage with a UUID filename
  //       await uploadBytes(avatarStorageRef, avatarBlob, {
  //         cacheControl: "public,max-age=31536000", // 1 year cache
  //       });

  //       // Get the download URL for the uploaded avatar
  //       const avatarDownloadUrl = await getDownloadURL(avatarStorageRef);

  //       // Reference to the "users" collection in the Realtime Database
  //       const usersRef = ref(db, `users/${encodeUsername(user.username)}`);

  //       // Add user data (with avatarDownloadUrl) to the Realtime Database
  //       await set(usersRef, {
  //         userId: user.userId,
  //         username: user.username,
  //         displayName: user.displayName,
  //         avatarUrl: avatarDownloadUrl, // Save the download URL of the avatar
  //         connections: {}, // Initially empty connections
  //         lastActive: Date.now(), // Unix timestamp for last active time
  //       });

  //       console.log(`User ${user.username} added successfully with avatar.`);
  //     } catch (error) {
  //       console.error("Error adding user: ", error);
  //     }
  //   }
  // };

  // Function to add random mock connections to Firebase
  const addRandomConnections = async () => {
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

      // Reference to the 'connections' collection in Firebase
      const connectionsRef = ref(db, "connections");

      // Retrieve all existing connections
      const connectionsSnapshot = await get(connectionsRef);
      const existingConnections = connectionsSnapshot.val() || {};

      // Function to check if a connection already exists
      const connectionExists = (user1, user2) => {
        return Object.values(existingConnections).some(
          (connection) =>
            (connection.user1 === user1 && connection.user2 === user2) ||
            (connection.user1 === user2 && connection.user2 === user1)
        );
      };

      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);
      const users = Object.entries(usersSnapshot.val()).map(([, value]) => ({
        ...value,
      }));

      // Select two random users and add a new connection if it doesn't already exist
      const randomUser1 = encodeUsername(
        users[Math.floor(Math.random() * users.length)].username
      );
      let randomUser2 = randomUser1;

      // Make sure randomUser2 is different from randomUser1
      while (randomUser2 === randomUser1) {
        randomUser2 = encodeUsername(
          users[Math.floor(Math.random() * users.length)].username
        );
      }

      // Check user profile incomplete
      const user1DisplayName = users.find(
        (user) => encodeUsername(user.username) === randomUser1
      )?.displayName;

      const user2DisplayName = users.find(
        (user) => encodeUsername(user.username) === randomUser2
      )?.displayName;

      console.log("user1DisplayName", user1DisplayName);
      console.log("user2DisplayName", user2DisplayName);

      if (!user1DisplayName || !user2DisplayName) {
        setIsLoading(false);
        openDialog({
          type: "error",
          title: "User data incomplete",
          content: `Please ask ${randomUser1} or ${randomUser2} to update their profile.`,
          onClose: () => {
            setIsLoading(false);
            closeDialog();
          },
        });
        return;
      }

      // Check if the connection between these two users already exists
      if (!connectionExists(randomUser1, randomUser2)) {
        const newConnectionRef = push(connectionsRef);

        const currentTimestamp = Date.now();

        // Add the new connection to Firebase with a timestamp
        await set(newConnectionRef, {
          id: newConnectionRef.key,
          user1: randomUser1,
          user2: randomUser2,
          timestamp: currentTimestamp, // Unix timestamp of when the connection was made
        });

        const userConnectionsRef = ref(db, `users/${randomUser1}/connections`);

        await update(userConnectionsRef, {
          [randomUser2]: {
            timestamp: currentTimestamp,
          },
        });

        const userRef = ref(db, `users/${randomUser1}`);
        await update(userRef, {
          lastActive: currentTimestamp,
        });

        const otherUserConnectionsRef = ref(
          db,
          `users/${randomUser2}/connections`
        );
        await update(otherUserConnectionsRef, {
          [randomUser1]: {
            timestamp: currentTimestamp,
          },
        });

        const otherUserRef = ref(db, `users/${randomUser2}`);
        await update(otherUserRef, {
          lastActive: currentTimestamp,
        });

        console.log(
          `New connection added between ${randomUser1} and ${randomUser2}`
        );

        enqueueSnackbar(
          `New connection added between ${randomUser1} and ${randomUser2}`,
          {
            variant: "success",
          }
        );
      } else {
        console.log(
          `Connection between ${randomUser1} and ${randomUser2} already exists.`
        );

        enqueueSnackbar(
          `Connection between ${randomUser1} and ${randomUser2} already exists.`,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.error("Error retrieving connections: ", error);
      enqueueSnackbar("Error adding random connections.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {/* <button onClick={addUsersToDatabase}>Add Users to Database</button> */}
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={isConnectionEnabled}
              onChange={toggleConnectionStatus}
              disabled={isLoading}
            />
          }
          label="Enable Connections"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isAvailableToDownloadPostcard}
              onChange={toggleAvailableToDownloadPostcard}
              disabled={isLoading}
            />
          }
          label="Available to Download Postcard"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isGuestRegistrationEnabled}
              onChange={toggleGuestRegistration}
              disabled={isLoading}
            />
          }
          label="Enable Guest Registration"
        />
        <Button
          variant="contained"
          onClick={addRandomConnections}
          disabled={isLoading}
        >
          Scan QR
        </Button>
        <Button
          variant="contained"
          onClick={addRandomConnections}
          disabled={isLoading}
        >
          Add Random Connections
        </Button>

        <input
          type="number"
          value={guestStart}
          onChange={(e) => setGuestStart(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="number"
          value={guestEnd}
          onChange={(e) => setGuestEnd(e.target.value)}
          disabled={isLoading}
        />

        <Button
          variant="contained"
          // onClick={() => addGuestsToDatabase(guestStart, guestEnd)}
          onClick={() => {
            openDialog({
              type: "confirm",
              title: "Add Guests to Database",
              content: `Are you sure you want to add guests ${guestStart} to ${guestEnd} to the database?`,
              onConfirm: () => addGuestsToDatabase(guestStart, guestEnd),
            });
          }}
          disabled={isLoading}
        >
          Add Guests to Database
        </Button>
        <Button
          variant="contained"
          // onClick={clearConnections}
          onClick={() => {
            openDialog({
              type: "confirm",
              title: "Clear Connections",
              content: "Are you sure you want to clear all connections?",
              onConfirm: clearConnections,
            });
          }}
          disabled={isLoading}
        >
          Clear Connections
        </Button>
      </Stack>
      <h4>Postcard Printing </h4>
      <div className="flex flex-col h-500px overflow-y-auto">
        {sortedUsersByRanking.map((user, index) => (
          <div className="flex mb-6" key={user.username}>
            <span>{index + 1}</span>
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <span>{user.displayName}</span>
            <Button
              variant="contained"
              onClick={() => {
                const sortedConnectionsByTimestamp = Object.entries(
                  user.connections
                ).sort((a, b) => a[1].timestamp - b[1].timestamp);

                console.log("Here", sortedConnectionsByTimestamp);

                const data = {
                  total: Object.keys(user.connections).length,
                  rank: index + 1,
                  displayName: user.displayName,
                  avatarUrl: `${user.avatarUrl}&v=${new Date().getTime()}`,
                  // connections: connections.map((connection) => ({
                  //   displayName: connection.displayName,
                  //   avatarUrl: `${
                  //     connection.avatarUrl
                  //   }&v=${new Date().getTime()}`,
                  // })),
                  connections: sortedConnectionsByTimestamp.map(
                    ([username]) => ({
                      displayName: users[username]?.displayName,
                      avatarUrl: `${
                        users[username]?.avatarUrl
                      }&v=${new Date().getTime()}`,
                    })
                  ),
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
              }}
            >
              Print
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Mockup;
