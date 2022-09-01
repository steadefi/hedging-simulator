import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// import Select from "@mui/material/Select";

export default function ClickButton({ onClick }) {
  // const handleChange = (event) => {
  //   onChanged(event);
  //   console.log(event);

  // call cal function > get return("result")
  // update parent component(chart + table)
  // };
  return (
    <Stack spacing={50} direction="row">
      <Button variant="contained" onClick={onClick} style={{ fontSize: 22 }}>
        Backtest
      </Button>
    </Stack>
  );
}
