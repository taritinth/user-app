import { styled as muiStyled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

import {
  Primary,
  Secondary,
  Focused,
  Red,
  Grey,
  White,
  White01,
} from "src/styles/color";

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
    outlineColor: Focused,
    boxShadow: "none",
  },
  "&.MuiButton-contained": {
    backgroundColor: Primary,
    color: White,
    ":hover": {
      backgroundColor: Red,
    },
    ":disabled": {
      backgroundColor: White01,
      color: Grey,
    },
  },
  "&.MuiButton-secondary": {
    backgroundColor: Secondary,
    color: Primary,
    ":hover": {
      backgroundColor: Secondary,
      color: Red,
    },
    ":active": {
      backgroundColor: Secondary,
      color: Red,
    },
    ":focus": {
      backgroundColor: Secondary,
      color: Red,
    },
    ":disabled": {
      backgroundColor: White01,
      color: Grey,
    },
  },
  "&.MuiButton-outlined": {
    border: `1px ${Primary} solid`,
    color: Primary,
    // backgroundColor: Secondary,
    ":hover": {
      color: Red,
      backgroundColor: Secondary,
    },
    ":disabled": {
      border: `1px ${Grey} solid`,
      color: Grey,
      backgroundColor: White01,
    },
  },
  "&.MuiButton-text": {
    color: Primary,
    ":active": {
      color: Red,
    },
    ":hover": {
      color: Red,
      backgroundColor: "transparent",
    },
    ":disabled": {
      backgroundColor: "transparent",
      color: Grey,
    },
  },
}));

export default Button;
