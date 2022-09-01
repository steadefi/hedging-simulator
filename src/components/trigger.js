import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Tigger({ onChange, value }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" style={{ fontSize: 22 }}>
          Tigger Type
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          // multiple

          id="demo-simple-select"
          value={value}
          label="Tigger"
          onChange={onChange}
          style={{ fontSize: 22 }}
        >
          <MenuItem value={0} style={{ fontSize: 22 }}>
            Debt Ratio
          </MenuItem>
          <MenuItem value={1} style={{ fontSize: 22 }}>
            Net Delta
          </MenuItem>
          <MenuItem value={2} style={{ fontSize: 22 }}>
            Fixed Time
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
