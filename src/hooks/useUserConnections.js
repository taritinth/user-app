import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";

// Real-time listener for user's connections
const useUserConnections = (username) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      const db = getDatabase();
      const userConnectionsRef = ref(db, `users/${username}/connections`);

      const userSnapshot = await get(userConnectionsRef);
      const data = userSnapshot.val();
      if (data) {
        setConnections(Object.keys(data));
      }

      const unsubscribe = onValue(userConnectionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setConnections(Object.keys(data));
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
