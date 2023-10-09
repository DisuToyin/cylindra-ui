import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function BasicSelect({ labelName, menuItemsList, interval, setInterval }) {
  const handleChange = (event) => {
    setInterval(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{labelName}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={interval}
          label={labelName}
          onChange={handleChange}
        >
          <MenuItem value={5}>5 Minutes</MenuItem>
          <MenuItem value={10}>10 Minutes</MenuItem>
          <MenuItem value={30}>30 Minutes</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
