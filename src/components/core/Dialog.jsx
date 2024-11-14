import { styled as muiStyled } from "@mui/material/styles";
import MuiDialog from "@mui/material/Dialog";

const Dialog = muiStyled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(3),
    paddingBottom: 0,
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
    border: 0,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
    paddingTop: 0,
  },
}));

export default Dialog;
