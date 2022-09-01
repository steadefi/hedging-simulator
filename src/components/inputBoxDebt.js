import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function InputBoxDebt({ onChange, inputValue }) {
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
        label="(Tigger) Debt"
        onChange={onChange}
        helperText="Example: 65"
      />
    </Box>
  );
}
