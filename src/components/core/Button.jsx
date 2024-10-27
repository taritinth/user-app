import { styled as muiStyled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

import { Grey, Primary, White, White01 } from "../../styles/color";

const Button = muiStyled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "sx",
})(() => ({
  borderRadius: 16,
  textTransform: "none",
  boxShadow: "none",
  ":focus:not(:focus-visible)": {
    outline: "none",
    boxShadow: "none",
  },
  ":hover": {
    boxShadow: "none",
  },
  ":active": {
    boxShadow: "none",
  },
  ":focus": {
    outlineStyle: "solid",
    outlineWidth: "2px",
    outlineOffset: "0px",
    outlineColor: Primary,
    boxShadow: "none",
  },
  "&.MuiButton-contained": {
    backgroundColor: Primary,
    color: White,
    ":hover": {
      backgroundColor: Primary,
    },
    ":disabled": {
      backgroundColor: White01,
      color: Grey,
    },
  },
  "&.MuiButton-text": {
    color: Primary,
    ":active": {
      color: Primary,
    },
    ":hover": {
      color: Primary,
      backgroundColor: "transparent",
    },
    ":disabled": {
      backgroundColor: "transparent",
      color: Grey,
    },
  },
}));

export default Button;
