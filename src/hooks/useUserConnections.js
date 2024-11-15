import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";

import { encodeUsername } from "../utils";
import { db } from "../firebase";

import { useDebounce } from "@uidotdev/usehooks";

// Real-time listener for user's connections
const useUserConnections = (username) => {
  const [connections, setConnections] = useState([]);

  const [users, setUsers] = useState({});
  const debouncedUsers = useDebounce(users, 500);

  const [isLoading, setIsLoading] = useState(true);

  function getUsers() {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val() || {};
      setUsers(users);
    });
  }

  const sortedUsersByRanking = Object.values(debouncedUsers)
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

  console.log("sortedUsersByRanking", sortedUsersByRanking);

  const userRanking =
    sortedUsersByRanking.findIndex((user) => user.username === username) + 1;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!username) {
      console.log("No username provided.");
      setIsLoading(false);
      return;
    }

    const fetchConnections = async () => {
      const db = getDatabase();
      const userConnectionsRef = ref(
        db,
        `users/${encodeUsername(username)}/connections`
      );

      const unsubscribe = onValue(userConnectionsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const sortedConnectionsByTimestamp = Object.entries(data).sort(
            (a, b) => a[1].timestamp - b[1].timestamp
          );
          console.log(
            "sortedConnectionsByTimestamp",
            sortedConnectionsByTimestamp
          );

          const connections = sortedConnectionsByTimestamp.map(
            async ([key]) => {
              const connectionRef = ref(db, `users/${key}`);
              const connectionSnapshot = await get(connectionRef);
              const connectionData = connectionSnapshot.val();

              return {
                ...connectionData,
              };
            }
          );

          Promise.all(connections).then((connections) => {
            setConnections(connections);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      });

      return unsubscribe;
    };

    const unsubscribe = fetchConnections();

    return () => unsubscribe;
  }, [username]);

  return { connections, rank: userRanking, isLoading };
};

export default useUserConnections;
