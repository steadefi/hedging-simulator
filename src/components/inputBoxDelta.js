import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function InputBoxDelta({ onChange, inputValue }) {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "30ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        value={inputValue}
        label="(Tigger) Delta"
        onChange={onChange}
        helperText="Example: 0.4"
      />
    </Box>
  );
}
