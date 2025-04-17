import { MenuItem } from '@/interface/types';
import {
  mdiBreadSlice,
  mdiChartBar,
  mdiFlash,
  mdiHome,
  mdiLiquidSpot,
  mdiVideoHighDefinition,
} from '@mdi/js';

export const dashboardMenuItems: MenuItem[] = [
  {
    id: 'user-management',
    name: 'Home',
    path: '/',
    icon: mdiHome,
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    path: '/mev/ethereum/sandwich',
    icon: mdiBreadSlice,
  },
  {
    id: 'liquidation',
    name: 'Liquidation',
    path: '/mev/ethereum/liquidation',
    icon: mdiLiquidSpot,
  },
  {
    id: 'Flashloan',
    name: 'Flashloan',
    path: '/mev/ethereum/flashloan',
    icon: mdiFlash,
  },
  {
    id: 'txr',
    name: 'MEV Live-stream',
    path: '/mev/ethereum/txr',
    icon: mdiVideoHighDefinition,
  },
]; 