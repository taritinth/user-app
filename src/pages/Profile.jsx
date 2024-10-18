import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import useUserConnections from "../hooks/useUserConnections";
import { encodeUsername } from "../utils";

import { Scanner } from "@yudiel/react-qr-scanner";

const Profile = () => {
  let connections = useUserConnections();

  const [user, setUser] = useState(null);

  const createConnection = async (username) => {
    const connectionsRef = ref("connections");
    const newConnectionRef = connectionsRef.push();

    const isConnected = user?.connections?.[username];

    if (!isConnected) {
      await set(newConnectionRef, {
        user1: user.username,
        user2: username,
        timestamp: Date.now(),
      });

      const userConnectionsRef = ref(
        db,
        `users/${encodeUsername(user.username)}/connections`
      );

      await update(userConnectionsRef, {
        [username]: true,
      });

      const otherUserConnectionsRef = ref(
        db,
        `users/${encodeUsername(username)}/connections`
      );
      await update(otherUserConnectionsRef, {
        [user.username]: true,
      });
    }
  };

  const fetchUserInfo = async (username) => {
    const parsedUsername = username.replace(".", "-");
    const userRef = ref(db, `users/${parsedUsername}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    setUser(userData);
  };

  useEffect(() => {
    fetchUserInfo("chackky");
  }, []);

  console.log("user logs", user);

  //   Test Commit

  return (
    <div>
      Profile
      <Scanner
        formats={["qr_code", "databar", "databar_expanded", "codabar"]}
        onScan={(result) => {
          alert(JSON.stringify(result));
        }}
        onError={(error) => {
          alert(JSON.stringify(error));
        }}
        components={{
          audio: false,
          onOff: true,
          torch: true,
          zoom: true,
          finder: true,
          tracker: "outline",
        }}
        allowMultiple={true}
        scanDelay={2000}
      />
    </div>
  );
};

export default Profile;
