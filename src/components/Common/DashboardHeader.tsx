'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
} from '@mdi/js';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

export default function DashboardHeader() {
  const { toggle } = useMenuSidebar();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Chức năng tìm kiếm đang được phát triển');
  };
  const { isOpen } = useMenuSidebar();
  return (
    <div className="
    w-screen fixed top-0 left-0 right-0 z-50
    p-4 bg-mainBackgroundV1 border-b border-b-mainBorderV1 flex justify-between items-center h-[78px]">
      <div className='flex items-center w-[244px] justify-between'>
        <Link href="/">
          <div className='h-8 w-[138px] relative'>
            <Image
              width={200}
              height={200}
              quality={100}
              draggable={false}
              src="/images/logo.svg" alt="logo"
              className='object-contain h-full w-full' />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7"
        >
          {
            isOpen ? (
              <IconChevronsLeft size={24} className='text-mainActiveV1 !h-5 !w-5' />
            ) : (
              <IconChevronsRight size={24} className='text-mainActiveV1 !h-5 !w-5' />
            )
          }
        </Button>
      </div>
      <div className="flex items-center gap-4">

        <Button variant="outline" className='bg-transparent border-mainBorderV1 hover:border-mainActiveV1 hover:bg-mainActiveV1/10 h-9 !text-white'>
          Ethereum
        </Button>

        <form className="relative hidden md:flex items-center" onSubmit={handleSearchSubmit}>
          <Input
            placeholder="Search by Address/Txn Hash/Block Number/Symbol"
            className='w-[440px] h-9'
          />
          <Icon
            path={mdiMagnify}
            size={0.8}
            className="absolute right-3 text-mainGrayV1"
          />
        </form>
      </div>
    </div>
  );
} 