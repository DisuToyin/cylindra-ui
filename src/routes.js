import { BrowserRouter as Router, Routes, Route, Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Page404 from './pages/Page404';
import Checks from './pages/Checks';

import DashboardAppPage from './pages/DashboardAppPage';
import SingleCheck from './pages/SingleCheck';
import AddCheck from './pages/AddCheck';

import useAuth from './hooks/useAuth';
// ----------------------------------------------------------------------

export default function RouterPage() {
  const { auth } = useAuth();
  console.log({ routes: auth });

  const protected_ = [
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'checks', element: <Checks /> },
        { path: 'add', element: <AddCheck /> },
        { path: 'check/:id', element: <SingleCheck /> },
        { path: 'user', element: <UserPage /> },
      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ];

  const general = [
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ];

  const routes_ = auth ? protected_ : general;
  const routes = useRoutes(routes_);

  return routes;
}
