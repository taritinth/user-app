import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import useUserConnections from "../hooks/useUserConnections";

const Profile = () => {
  let connections = useUserConnections();

  const [user, setUser] = useState(null);

  const createConnection = async (username) => {
    const connectionsRef = db.ref("connections");
    const newConnectionRef = connectionsRef.push();

    const isConnected = user?.connections?.[username];

    if (!isConnected) {
      await newConnectionRef.set({
        user1: user.username,
        user2: username,
        timestamp: Date.now(),
      });

      const userConnectionsRef = db.ref(`users/${user.username}/connections`);
      await userConnectionsRef.update({
        [username]: true,
      });

      const otherUserConnectionsRef = db.ref(`users/${username}/connections`);
      await otherUserConnectionsRef.update({
        [user.username]: true,
      });
    }
  };

  const fetchUserInfo = async (username) => {
    const userRef = db.ref(`users/${username}`);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.val();
    setUser(userData);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [connections]);

  return <div>Profile</div>;
};

export default Profile;
