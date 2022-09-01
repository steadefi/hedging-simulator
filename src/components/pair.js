import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Pair({ onChange, value }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" style={{ fontSize: 22 }}>
          Pair
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Pair"
          onChange={onChange}
          style={{ fontSize: 22 }}
        >
          <MenuItem value={"AVAXUSDC"} style={{ fontSize: 22 }}>
            AVAX/USDC
          </MenuItem>
          <MenuItem value={"BNBUSDC"} style={{ fontSize: 22 }}>
            BNB/USDC
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
