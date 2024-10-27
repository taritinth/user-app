import { styled as muiStyled } from "@mui/material/styles";
import MuiDialog from "@mui/material/Dialog";

const Dialog = muiStyled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 32,
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
    border: 0,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
    // paddingTop: 0,
  },
}));

export default Dialog;
