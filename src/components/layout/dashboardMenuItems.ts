import { MenuItem } from '@/interface/types';
import {
  mdiClock,
  mdiBadgeAccount,
  mdiHome,
} from '@mdi/js';

export const getDashboardMenuItems = (account: string | null): MenuItem[] => {
  const baseMenuItems: MenuItem[] = [
    {
      id: 'user-management',
      name: 'Home',
      path: '/',
      icon: mdiHome,
    }
  ];

  if (account) {
    baseMenuItems.push({
      id: 'portfolio',
      name: 'Portfolio',
      path: '/mev/ethereum/portfolio',
      icon: mdiBadgeAccount,
    });
  }

  baseMenuItems.push({
    id: 'latest',
    name: 'MEV Lastest',
    path: '/mev/ethereum/latest',
    icon: mdiClock,
  });

  return baseMenuItems;
}; 