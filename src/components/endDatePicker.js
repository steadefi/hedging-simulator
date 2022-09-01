import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function EndDate({ onChanged, min, max }) {
  const handleChange_1 = (event) => {
    onChanged(event);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="End Date"
        value={max}
        onChange={handleChange_1}
        minutesStep={60}
        minDateTime={new Date(min)}
        maxDateTime={new Date(max)}
      />
    </LocalizationProvider>
  );
}
