import { Button } from "@mui/material";

function SecondaryButton({ medium, outlined, children, ...otherProps }) {
  return (
    <Button
      size={medium ? "medium" : "small"}
      variant={outlined ? "outlined" : "contained"}
      color="secondary"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default SecondaryButton;
