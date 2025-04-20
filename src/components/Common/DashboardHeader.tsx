'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import {
  mdiEthereum,
  mdiMagnify,
  mdiWalletPlus,
} from '@mdi/js';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { useGetMevTransactionByHash } from '@/hooks/useMev';
import { cn, formatDate, formatAddress } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const { toggle } = useMenuSidebar();
  const { isOpen } = useMenuSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: apiResponse } = useGetMevTransactionByHash(
    searchTerm.length > 10 ? searchTerm : ''
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsResultVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 10) {
      setIsSearching(true);
      setIsResultVisible(true);
    } else {
      setIsResultVisible(false);
    }
  };
  const handleSearchItemClick = (hash: string) => {
    setIsResultVisible(false);
    router.push(`/mev/ethereum/tx/${hash}`);
  };

  return (
    <div className="
    w-full fixed top-0 left-0 right-0 z-[1000]
    p-4 bg-mainBackgroundV1 border-b border-b-mainBorderV1 flex justify-between items-center h-[78px]">
      <div className='flex items-center w-[244px] justify-between'>
        <Link href="/">
          <div className='text-mainActiveV1 text-3xl font-bold flex items-center gap-0'>
            <span className='mr-[-3px] tracking-tighter'>Mev</span>
            <Icon path={mdiEthereum} size={1.2} className='text-mainActiveV1 mx-[-2px]' />
            <span className='text-mainGrayV1 ml-[-3px] tracking-tighter'>Inspect</span>
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
        <div className="relative hidden md:block">
          <form className="relative flex items-center gap-4">
            <Input
              ref={inputRef}
              placeholder="Search by Address/Txn Hash/Block Number/Symbol"
              className='w-[440px] h-9 text-mainGrayV1'
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm.length > 10 && setIsResultVisible(true)}
            />
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded-sm bg-mainCardV1 transition-colors">
              <Icon path={mdiWalletPlus} size={0.7} className="text-mainActiveV1" />
              <span className="text-sm text-mainActiveV1">Connect Wallet</span>
            </button>
          </form>



          {isResultVisible && apiResponse && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 max-h-[400px] overflow-y-auto"
            >
              // TODO: Fix this for sandwich
              <div
                className="p-3 hover:bg-mainActiveV1/10 cursor-pointer border-b border-mainBorderV1"
                onClick={() => handleSearchItemClick(apiResponse?.hash)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-mainActiveV1 font-medium truncate max-w-[250px]">
                    {apiResponse?.hash}
                  </div>
                  <div className="text-xs text-mainGrayV1">
                    {formatDate(apiResponse?.timestamp || apiResponse?.time || '')}
                  </div>
                </div>
                <div className="mt-1 flex justify-between">
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-mainGrayV1">Block:</span>
                    <span className='text-white'>{apiResponse?.blockNumber}</span>
                  </div>
                  {apiResponse?.label && (
                    // TODO: change this color for 3 other labels
                    <div className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      apiResponse?.label === "ARBITRAGE" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    )}>
                      {apiResponse?.label}
                    </div>
                  )}
                </div>
                <div className="mt-1 text-sm flex justify-between">
                  <div className='flex items-center gap-1'>
                    <span className="text-mainGrayV1">From:</span>
                    <span className='text-white'>{formatAddress(apiResponse?.from)}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className="text-mainGrayV1">To:</span>
                    <span className='text-white'>{formatAddress(apiResponse?.to)}</span>
                  </div>
                </div>
                {apiResponse?.profit && (
                  <div className="mt-1 text-sm flex items-center gap-1">
                    <span className="text-mainGrayV1">Profit:</span>
                    <span className='text-white'>{parseFloat(apiResponse?.profit).toFixed(4)} ETH</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 