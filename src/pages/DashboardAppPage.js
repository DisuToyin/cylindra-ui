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
  // console.log(auth);

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
              total={dashboardData?.data?.sites_total || 'N/A'}
              icon={'ant-design:android-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Up"
              total={dashboardData?.data?.sites_up || 'N/A'}
              color="success"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Down"
              total={dashboardData?.data?.sites_down || 'N/A'}
              color="error"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              style={{ cursor: 'pointer' }}
              title="Paused"
              total={dashboardData?.data?.sites_down || 'N/A'}
              color="warning"
              icon={'ant-design:bug-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Checks"
              subheader=""
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
              ]}
              chartData={
                dashboardData?.data && dashboardData?.data?.sites_graph?.length > 0
                  ? dashboardData?.data?.sites_graph
                  : []
              }
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
