import React from "react";
import { useImageExporter } from "../hooks/useImageExporter";
import Dialog from "../components/core/Dialog";
import {
  Box,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const DialogPostcard = ({ onClose }) => {
  const { exportedURL, exportRefCallback } = useImageExporter();

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      sx={{
        ...(typeof maxWidth === "number" && {
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
            },
          },
        }),
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Save Postcard
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <div className="h-0 w-0 overflow-hidden">
          <div
            ref={exportRefCallback}
            className="flex w-[611px] h-[989px] flex-col items-center justify-between overflow-hidden bg-white"
          >
            1
          </div>
        </div>
        {!exportedURL ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <img
            src={exportedURL}
            alt="Postcard"
            className="w-full max-w-sm h-auto rounded-[24px] object-contain"
          />
        )}

        <div className="flex items-center mt-4">
          {!exportedURL ? (
            <p className="text-md text-center">
              Generating your postcard. Please wait...
            </p>
          ) : (
            <p className="text-md text-center">
              Long press on the above image and <b>Save Image</b> to your
              Gallery.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPostcard;
