import { MenuItem } from '@/interface/types';
import {
  mdiClock,
  mdiBadgeAccount,
  mdiHome,
} from '@mdi/js';

export const dashboardMenuItems: MenuItem[] = [
  {
    id: 'user-management',
    name: 'Home',
    path: '/',
    icon: mdiHome,
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    path: '/mev/ethereum/portfolio',
    icon: mdiBadgeAccount,
  },
  {
    id: 'latest',
    name: 'MEV Lastest',
    path: '/mev/ethereum/latest',
    icon: mdiClock,
  },
]; 