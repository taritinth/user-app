/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import DialogComponent from "./DialogComponent";

const DialogContext = createContext();

/**
 * @notice Hook for using DialogContext
 * @returns {{ openDialog: Function, closeDialog: Function, closeAllDialogs: Function }}
 */
export const useDialog = () => {
  const { openDialog, closeDialog, closeAllDialogs } =
    useContext(DialogContext);

  return { openDialog, closeDialog, closeAllDialogs };
};

const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  /**
   *
   * @param {Object} config { id, type, icon, title, content, actions, customDialog, timeout}
   * @returns {Number} dialogId - The ID of the opened dialog
   */
  const openDialog = (config) => {
    const { id, timeout, ...rest } = config;
    const dialogId = id ?? Math.random(); // Generate a unique ID for the dialog

    setDialogs((prevDialogs) => [...prevDialogs, { dialogId, ...rest }]);

    // Close the dialog after the specified timeout
    if (timeout) {
      setTimeout(() => {
        closeDialog(dialogId);
      }, timeout);
    }

    return dialogId; // Return the ID of the opened dialog
  };

  /**
   * @param {*} dialogId - The ID of the dialog to be closed (optional)
   * @returns {void}
   */
  const closeDialog = (dialogId) => {
    if (dialogId) {
      // If the dialogId is specified, Remove the dialog with the specified ID
      setDialogs((prevDialogs) =>
        prevDialogs.filter((dialog) => dialog.dialogId !== dialogId)
      );
    } else {
      // Else, Remove the last opened dialog
      setDialogs((prevDialogs) => prevDialogs.slice(0, -1));
    }
  };

  /**
   * @notice Close all opened dialogs
   * @returns {void}
   */
  const closeAllDialogs = () => {
    setDialogs([]);
  };

  /**
   * Disable scrolling when a dialog is opened
   */
  // useEffect(() => {
  //   if (dialogs.length > 0) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style = "none";
  //   }
  // }, [dialogs]);

  const dialogStore = {
    openDialog,
    closeDialog,
    closeAllDialogs,
  };

  return (
    <DialogContext.Provider value={dialogStore}>
      {children}
      {dialogs.map((dialog) => (
        <DialogComponent key={dialog.dialogId} dialog={dialog} />
      ))}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
