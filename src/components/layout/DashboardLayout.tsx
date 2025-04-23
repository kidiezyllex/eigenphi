'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@mdi/react';
import { MenuItem } from '@/interface/types';
import DashboardHeader from '../Common/DashboardHeader';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { getDashboardMenuItems } from './dashboardMenuItems';
import { useAddress } from '@/stores/useAddress';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { isOpen } = useMenuSidebar();
  const { account } = useAddress();
  const dashboardMenuItems = getDashboardMenuItems(account);

  const isMenuActive = (menu: MenuItem) => {
    if (menu.path && pathname === menu.path) return true;
    return false;
  };

  const handleMouseEnter = (menuId: string) => {
    if (!isOpen) {
      setHoverMenu(menuId);
    }
  };

  const handleMouseLeave = () => {
    setHoverMenu(null);
  };

  return (
    <div className="flex min-h-screen bg-mainBackgroundV1">
      <div
        className={cn(
          "bg-mainBackgroundV1 border-r border-r-mainBorderV1 fixed top-0 left-0 right-0 z-50 mt-[78px] shadow-md min-h-screen transition-all duration-300",
          isOpen ? "w-[260px]" : "w-0 md:w-16 overflow-hidden flex justify-center"
        )}
      >
        <div className="flex flex-col h-full">
         
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className={cn("", isOpen ? "px-2" : "px-1")}>
              {dashboardMenuItems.map((menu) => (
                <li key={menu.id}>
                   <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link href={menu.path}>
                        <div
                          className={cn(
                            'flex items-center rounded-lg p-[10px] h-[46px] text-sm font-medium transition-colors',
                            isMenuActive(menu)
                              ? 'bg-mainCardV1 text-mainActiveV1'
                              : 'text-mainGrayV1 hover:bg-mainCardV1',
                            !isOpen && '!justify-center w-[46px]'
                          )}
                        >
                          <div className={cn('!w-7 !h-7 flex-shrink-0 rounded-sm flex items-center justify-center', 
                            isMenuActive(menu) ? 'bg-mainBackgroundV1' : 'bg-mainCardV1',
                            isOpen ? 'mr-4' : 'mr-0'
                          )}>
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              isMenuActive(menu) ? '!text-mainActiveV1 flex-shrink-0' : '!text-mainGrayV1 flex-shrink-0'
                            )}
                          />
                          </div>
                          {isOpen && <span className='text-nowrap'>{menu.name}</span>}
                        </div>
                      </Link>
                      {!isOpen && hoverMenu === menu.id && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="fixed ml-16 mt-[-30px] bg-mainCardV1 border border-mainBorderV1 text-mainActiveV1 text-xs py-1.5 px-3 rounded-md shadow-light-grey z-50 whitespace-nowrap flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-mainActiveV1 mr-1.5"></span>
                            <span className="font-medium">{menu.name}</span>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className={`flex-1 overflow-auto bg-mainDarkBackgroundV1 ${isOpen ? 'pl-[260px]' : 'pl-[68px]'} mt-[78px] min-h-screen transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
} 