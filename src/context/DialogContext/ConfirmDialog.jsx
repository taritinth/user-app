/* eslint-disable react/prop-types */
// import { useState } from "react";
import Dialog from "../../components/core/Dialog";
import { Button } from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Typography } from "@mui/material";

// import font from "src/styles/font";
// import { useLoading } from "../LoadingContext";

/**
 * @notice This is a reusable component for Confirm Dialog Body
 * that can be used in any dialog component.
 * @param {JSX.Element |String} title
 */
export const ConfirmDialogBody = ({ title }) => {
  return (
    <DialogContent dividers>
      <Typography
        sx={{
          fontSize: "1rem",
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {title}
      </Typography>
    </DialogContent>
  );
};

const ConfirmDialog = ({
  title,
  actions,
  onConfirm,
  onCancel,
  maxWidth = "sm",
}) => {
  // const { setLoading } = useLoading();

  const handleConfirm = async () => {
    onCancel(); // close dialog first
    // setLoading(true);

    await onConfirm();

    // setLoading(false);
  };

  return (
    <Dialog
      onClose={onCancel}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth={typeof maxWidth === "string" && maxWidth}
      sx={{
        ...(typeof maxWidth === "number" && {
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth,
            },
          },
        }),
      }}
    >
      <ConfirmDialogBody title={title} />
      <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))
        ) : (
          <>
            <Button
              variant="secondary"
              size="large"
              sx={{ minWidth: 140 }}
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ minWidth: 140 }}
              onClick={handleConfirm}
            >
              ยืนยัน
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
