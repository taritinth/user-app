import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";

import { encodeUsername } from "../utils";

// Real-time listener for user's connections
const useUserConnections = (username) => {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return { connections, isLoading };
};

export default useUserConnections;
