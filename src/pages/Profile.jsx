import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import useUserConnections from "../hooks/useUserConnections";
import { encodeUsername } from "../utils";

import QRScanner from "../components/QRScanner";

const Profile = () => {
  let connections = useUserConnections("dos4289");

  const [user, setUser] = useState(null);

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

  console.log("user logs", user);
  console.log("connections logs", connections);

  //   Test Commit

  return (
    <div>
      Profile
      <QRScanner />
    </div>
  );
};

export default Profile;
