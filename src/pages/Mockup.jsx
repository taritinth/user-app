import { useState } from "react";

import { ref, set, push, get, update } from "firebase/database";
import { db } from "../firebase";
import { encodeUsername } from "../utils";

const users = [
  {
    userId: "882848248941908048",
    displayName: "beNADS ⨀",
    username: "be_kindplss",
    avatarUrl:
      "https://cdn.discordapp.com/guilds/1036357772826120242/users/882848248941908048/avatars/216a36ce826652056d19f6eeb1cb3c85.webp?size=256",
  },
  {
    userId: "731003193680461844",
    displayName: "Kan2106 ⨀ NPC#2106",
    username: "kan2106",
    avatarUrl:
      "https://cdn.discordapp.com/guilds/1036357772826120242/users/731003193680461844/avatars/a_8bf5aa3d6d1c3db36e7f6831fab18bf4.webp?size=256",
  },
  {
    userId: "864742916970512395",
    displayName: "JACK Benjamin",
    username: "jackbenjamin",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/864742916970512395/19c3f2d21a9de6ff776302451f03f581.webp?size=256",
  },
  {
    userId: "186053050664878080",
    displayName: "chackky 🥊🐔",
    username: "chackky",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/186053050664878080/0253979b3c13036df08c465d0e5a2ffc.webp?size=256",
  },
  {
    userId: "144610001627906048",
    displayName: "Sage (bedill monday)",
    username: "apesage",
    avatarUrl:
      "https://cdn.discordapp.com/guilds/1036357772826120242/users/144610001627906048/avatars/26dd75229aa9f338c6f9aa0b34eae0eb.webp?size=256",
  },
  {
    userId: "125728243130171392",
    displayName: "Papayou",
    username: "papayou",
    avatarUrl:
      "https://cdn.discordapp.com/guilds/1036357772826120242/users/125728243130171392/avatars/a_a984cc7301609f1c4eb4e8574433ea8a.webp?size=256",
  },
  {
    userId: "194960705345028096",
    displayName: "Cedweak 🐌",
    username: "ceeedweak",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/194960705345028096/fc6230f7aa13f0374d1ba9a74f700012.webp?size=256",
  },
  {
    userId: "196580115830800384",
    displayName: "Jedlyk | SGMY",
    username: "jedlyk",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/196580115830800384/15b260a54c1239a5e85dcb4f2ec8df92.webp?size=256",
  },
  {
    userId: "141522252712771586",
    displayName: "anki 🫧",
    username: "dani.dan",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/141522252712771586/ccdca6d80777f228d1b3761efef9eb97.webp?size=256",
  },
  {
    userId: "206131868230352896",
    displayName: "Nico",
    username: "n1c0cs",
    avatarUrl:
      "https://cdn.discordapp.com/guilds/1036357772826120242/users/206131868230352896/avatars/450fe8f13223ec11c9abe3c73a2ce148.webp?size=256",
  },
  {
    userId: "210264073936437249",
    displayName: "Matti (evm/acc) | NAD INC",
    username: "matti003",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/210264073936437249/59d3c9bc6d3112298e29ad48a1fc2538.webp?size=256",
  },
];

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
