/* eslint-disable react/prop-types */
import Dialog from "../../components/core/Dialog";
import { Button } from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Typography, Stack, Box } from "@mui/material";

// import font from "src/styles/font";
import { Red, DarkGrey } from "../../styles/color";

// import DangerIcon from "src/components/icon/Danger";

/**
 * @notice This is a reusable component for Error Dialog Body
 * that can be used in any dialog component.
 * @param {JSX.Element} icon
 * @param {JSX.Element |String} title
 * @param {JSX.Element | String} content
 */
export const ErrorDialogBody = ({ icon, title, content }) => {
  return (
    <DialogContent dividers>
      <Stack alignItems="center">
        {/* {icon ? icon : <DangerIcon size={40} />} */}
        <Typography
          sx={{
            marginTop: 3,
            color: Red,
            fontSize: "1rem",
            fontWeight: 600,
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            width: "100%",
            ...(typeof content === "string" && {
              color: DarkGrey,
              fontSize: "0.75rem",
              textAlign: "center",
            }),
          }}
        >
          {content}
        </Box>
      </Stack>
    </DialogContent>
  );
};

const ErrorDialog = ({
  icon,
  title,
  content,
  actions,
  onClose,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      onClose={onClose}
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
      <ErrorDialogBody icon={icon} title={title} content={content} />
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
              variant="contained"
              size="large"
              sx={{ minWidth: 140 }}
              onClick={onClose}
            >
              ปิด
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
