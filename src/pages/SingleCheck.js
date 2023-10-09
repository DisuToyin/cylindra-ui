import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import {
  Card,
  Table,
  Stack,
  Grid,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import { AppOrderTimeline, AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';

import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

export default function SingleCheck() {
  return (
    <Container>
      <section style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {' '}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            amazon.co.uk
          </Typography>
          <Label color={'error'}>Down</Label>
        </div>
        <div>
          <Button variant="outlined" style={{ marginRight: '1rem' }}>
            Edit
          </Button>
          <Button variant="outlined" color="error">
            Delete
          </Button>
        </div>
      </section>
      <Grid item xs={12} md={6} lg={8}>
        <AppWebsiteVisits
          title="Uptime graph"
          subheader="last 7 days"
          chartLabels={[
            '01/01/2003',
            '02/01/2003',
            '03/01/2003',
            '04/01/2003',
            '05/01/2003',
            '06/01/2003',
            '07/01/2003',
            '08/01/2003',
            '09/01/2003',
            '10/01/2003',
            '11/01/2003',
          ]}
          chartData={[
            {
              name: 'Company Site',
              type: 'line',
              fill: 'solid',
              //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
              data: [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
            },
          ]}
        />
      </Grid>
      <Grid style={{ marginTop: '2rem' }} item xs={12} md={6} lg={4}>
        <AppOrderTimeline
          title="Site Activity "
          list={[...Array(5)].map((i, index) => ({
            id: faker.datatype.uuid(),
            title: [
              'Went Down for 7min',
              '12 Invoices have been paid',
              'Order #37745 from September',
              'New order placed #XF-2356',
              'New order placed #XF-2346',
            ][index],
            type: `order${index + 1}`,
            time: faker.date.past(),
          }))}
        />
      </Grid>
    </Container>
  );
}
