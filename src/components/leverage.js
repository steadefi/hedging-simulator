import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Leverage({ onChange, value }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" style={{ fontSize: 22 }}>
          Leverage
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Leverage"
          onChange={onChange}
          style={{ fontSize: 22 }}
        >
          <MenuItem value={1} style={{ fontSize: 22 }}>
            1
          </MenuItem>
          <MenuItem value={2} style={{ fontSize: 22 }}>
            2
          </MenuItem>
          <MenuItem value={3} style={{ fontSize: 22 }}>
            3
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
