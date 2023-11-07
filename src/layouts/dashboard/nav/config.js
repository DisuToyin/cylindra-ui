// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'checks',
    path: '/dashboard/checks',
    icon: icon('ic_user'),
  },
  {
    title: 'manage-team',
    path: '/dashboard/team',
    icon: icon('ic_analytics'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'status',
    path: '/dashboard/status',
    icon: icon('ic_user'),
  },
  {
    title: 'settings',
    path: '/dashboard/settings',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'team',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
];

export default navConfig;
