import { useDialog } from "./DialogContext";
import ConfirmDialog from "./ConfirmDialog";
import SuccessDialog from "./SuccessDialog";
import ErrorDialog from "./ErrorDialog";

const DialogComponent = ({ dialog }) => {
  const { closeDialog } = useDialog();
  const {
    dialogId,
    type,
    icon,
    title,
    content,
    actions = [],
    customDialog,
    // defaultProps
    onClose = () => {
      closeDialog(dialogId);
    },
    // defaultConfirmProps
    confirmButtonLabel = "OK",
    cancelButtonLabel = "Cancel",
    onConfirm = () => {},
    onCancel = () => {
      closeDialog(dialogId);
    },
    ...rest
  } = dialog;

  /**
   * @notice Get the dialog component based on the type
   * @returns {JSX.Element} Dialog component
   */
  const getDialogComponent = () => {
    switch (type) {
      case "custom":
        return customDialog;
      case "info":
        return null;
      case "success":
        return (
          <SuccessDialog
            icon={icon}
            title={title}
            content={content}
            actions={actions}
            onClose={onClose}
            {...rest}
          />
        );
      case "error":
        return (
          <ErrorDialog
            icon={icon}
            title={title}
            content={content}
            actions={actions}
            onClose={onClose}
            {...rest}
          />
        );
      case "confirm":
        return (
          <ConfirmDialog
            title={title}
            actions={actions}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            onConfirm={onConfirm}
            onCancel={onCancel}
            {...rest}
          />
        );
      default:
        return null;
    }
  };

  return getDialogComponent();
};

export default DialogComponent;
