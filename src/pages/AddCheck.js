import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import BasicSelect from '../components/select/SelectComp';

export default function AddCheck() {
  const navigate = useNavigate();

  const handleChange = () => {};

  const [interval, setInterval] = useState(0);

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };
  return (
    <>
      <Typography style={{ marginBottom: '1rem' }} variant="h4" gutterBottom>
        Add Check
      </Typography>
      <div style={{ maxWidth: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Stack spacing={3}>
          <TextField style={{ width: '-webkit-fill-available' }} name="name" label="Check Name" />
          <TextField style={{ width: '-webkit-fill-available' }} name="link" label="Link" />{' '}
          <Typography color="error" variant="p" gutterBottom>
            Check the site availability every {interval} Minutes
          </Typography>
          <BasicSelect labelName="Interval" setInterval={setInterval} interval={interval} />
          <FormGroup style={{ display: 'flex' }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Email" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Slack" />
          </FormGroup>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Save
        </LoadingButton>
      </div>
    </>
  );
}
