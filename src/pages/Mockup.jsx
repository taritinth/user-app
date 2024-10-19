import { useState } from "react";

import { ref, set, push, get, update } from "firebase/database";
import { db } from "../firebase";
import { encodeUsername } from "../utils";

import users from "./results.json";

function Mockup() {
  const [count, setCount] = useState(0);

  // Function to add users to Firebase
  const addUsersToDatabase = async () => {
    for (const user of users) {
      // Create a reference for the "users" collection
      const usersRef = ref(db, `users/${encodeUsername(user.username)}`);

      try {
        // Add user data (displayName, avatarUrl, connections, lastActive)
        await set(usersRef, {
          userId: user.userId,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          connections: {}, // Initially empty connections
          lastActive: Date.now(), // Unix timestamp for last active time
        });
        console.log(`User ${user.username} added successfully.`);
      } catch (error) {
        console.error("Error adding user: ", error);
      }
    }
  };

  // Function to add random mock connections to Firebase
  const addMockConnections = async () => {
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

        const otherUserConnectionsRef = ref(
          db,
          `users/${randomUser2}/connections`
        );
        await update(otherUserConnectionsRef, {
          [randomUser1]: true,
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
    <>
      <button onClick={addUsersToDatabase}>Add Users to Database</button>
      <button onClick={addMockConnections}>Add Mock Connections</button>
    </>
  );
}

export default Mockup;
