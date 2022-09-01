import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function SwitchTigger({ onChange, value }) {
  return (
    <FormGroup value={value} onChange={onChange}>
      <FormControlLabel control={<Switch value={0} />} label="Debt Ratio" />
      <FormControlLabel control={<Switch value={1} />} label="Net Delta" />
      <FormControlLabel
        control={<Switch defaultChecked value={2} />}
        label="Fixed Time"
      />
    </FormGroup>
  );
}
