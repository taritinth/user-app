import { createContext, useContext, useState } from "react";

import Loading from "../components/Loading";
import ReactDOM from "react-dom";

const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading &&
        ReactDOM.createPortal(
          <Loading />,
          document.getElementById("custom-root") // Ensure this div exists in your HTML
        )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
