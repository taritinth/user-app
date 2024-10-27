import { ref, set, push, get, update } from "firebase/database";
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
import { Stack } from "@mui/material";

function Mockup() {
  const clearConnections = async () => {
    const connectionsRef = ref(db, "connections");
    await set(connectionsRef, {});
    console.log("Connections cleared.");

    const usersRef = ref(db, "users");
    const usersSnapshot = await get(usersRef);
    const users = usersSnapshot.val();

    for (const userKey in users) {
      const userConnectionsRef = ref(db, `users/${userKey}/connections`);
      await set(userConnectionsRef, {});
      console.log(`Connections for ${userKey} cleared.`);
    }
  };

  // Add guests to the database e.g. guest1, guest2, etc.
  const addGuestsToDatabase = async (from, to) => {
    for (let i = from; i <= to; i++) {
      const username = `guest${i}`;
      const displayName = `Guest ${i}`;
      const avatarUrl =
        "https://pbs.twimg.com/profile_images/1810039515408678912/HIJv16jG_400x400.jpg";

      try {
        const uniqueFileName = `${encodeUsername(username)}.webp`;

        const avatarStorageRef = storageRef(
          storage,
          `avatars/${uniqueFileName}`
        );
        const avatarResponse = await fetch(avatarUrl);
        const avatarBlob = await avatarResponse.blob();

        await uploadBytes(avatarStorageRef, avatarBlob, {
          cacheControl: "public,max-age=31536000",
        });

        const avatarDownloadUrl = await getDownloadURL(avatarStorageRef);

        const usersRef = ref(db, `users/${encodeUsername(username)}`);

        await set(usersRef, {
          userId: uuidv4(),
          username,
          displayName,
          avatarUrl: avatarDownloadUrl,
          connections: {},
          lastActive: Date.now(),
        });

        console.log(`User ${username} added successfully with avatar.`);
      } catch (error) {
        console.error("Error adding user: ", error);
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

      // Check if the connection between these two users already exists
      if (!connectionExists(randomUser1, randomUser2)) {
        const newConnectionRef = push(connectionsRef);

        // Add the new connection to Firebase with a timestamp
        await set(newConnectionRef, {
          id: newConnectionRef.key,
          user1: randomUser1,
          user2: randomUser2,
          timestamp: Date.now(), // Unix timestamp of when the connection was made
        });

        const userConnectionsRef = ref(db, `users/${randomUser1}/connections`);

        await update(userConnectionsRef, {
          [randomUser2]: true,
        });

        const userRef = ref(db, `users/${randomUser1}`);
        await update(userRef, {
          lastActive: Date.now(),
        });

        const otherUserConnectionsRef = ref(
          db,
          `users/${randomUser2}/connections`
        );
        await update(otherUserConnectionsRef, {
          [randomUser1]: true,
        });

        const otherUserRef = ref(db, `users/${randomUser2}`);
        await update(otherUserRef, {
          lastActive: Date.now(),
        });

        console.log(
          `New connection added between ${randomUser1} and ${randomUser2}`
        );
      } else {
        console.log(
          `Connection between ${randomUser1} and ${randomUser2} already exists.`
        );
      }
    } catch (error) {
      console.error("Error retrieving connections: ", error);
    }
  };

  return (
    <Container>
      {/* <button onClick={addUsersToDatabase}>Add Users to Database</button> */}
      <Stack spacing={2}>
        <Button variant="contained" onClick={addRandomConnections}>
          Add Random Connections
        </Button>
        <Button variant="contained" onClick={() => addGuestsToDatabase(1, 5)}>
          Add Guests to Database
        </Button>
        <Button variant="contained" onClick={clearConnections}>
          Clear Connections
        </Button>
      </Stack>
    </Container>
  );
}

export default Mockup;
