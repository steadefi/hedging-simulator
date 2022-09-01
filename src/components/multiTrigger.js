import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Debt Ratio", "Net Delta", "Fixed Time"];

export default function MultipleTrigger({ onChange, value }) {
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Tigger</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={names[value]} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
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
    </div>
  );
}
