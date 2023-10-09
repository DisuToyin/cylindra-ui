import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import { AppOrderTimeline, AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';
// ----------------------------------------------------------------------
import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

export default function DashboardAppPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  console.log(auth);

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getDashboardData = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/dashboard', {
          signal: controller.signal,
        });
        console.log({ web: data });
        if (isMounted) setDashboardData(data);
      } catch (err) {
        console.error(err);
        // navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getDashboardData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Cylindra UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {auth?.user?.name}, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Total Checks"
              color="info"
              total={dashboardData?.data?.sites_total || 0}
              icon={'ant-design:android-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Up"
              total={dashboardData?.data?.sites_up || 0}
              color="success"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Down"
              total={dashboardData?.data?.sites_down || 0}
              color="error"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Paused"
              total={0}
              color="warning"
              icon={'ant-design:bug-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Checks"
              subheader="(+43%) than last year"
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
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Event Timeline"
              list={dashboardData?.data?.events_timeline?.map((_, index) => ({
                id: _?.id,
                title: `${_?.web_id?.link}'s is ${_?.event_type}`,
                type: `order${index + 1}`,
                time: _?.createdAt,
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
