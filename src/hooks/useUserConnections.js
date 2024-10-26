import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";

import { encodeUsername } from "../utils";

// Real-time listener for user's connections
const useUserConnections = (username) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (!username) {
      console.log("No username provided.");
      return;
    }

    const fetchConnections = async () => {
      const db = getDatabase();
      const userConnectionsRef = ref(
        db,
        `users/${encodeUsername(username)}/connections`
      );

      // const userSnapshot = await get(userConnectionsRef);
      // const data = userSnapshot.val();
      // if (data) {
      //   setConnections(Object.keys(data));
      // }

      const unsubscribe = onValue(userConnectionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const connections = Object.keys(data).map(async (key) => {
            const connectionRef = ref(db, `users/${key}`);
            const connectionSnapshot = await get(connectionRef);
            const connectionData = connectionSnapshot.val();

            return {
              ...connectionData,
            };
          });

          Promise.all(connections).then((connections) => {
            setConnections(connections);
          });

          // setConnections(Object.keys(data));
        }
      });

      return unsubscribe;
    };

    const unsubscribe = fetchConnections();

    return () => unsubscribe;
  }, [username]);

  return connections;
};

export default useUserConnections;
