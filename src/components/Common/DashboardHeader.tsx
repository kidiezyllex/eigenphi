'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import {
  mdiEthereum,
  mdiWalletPlus,
  mdiRobotVacuumAlert,
} from '@mdi/js';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { useGetMevTransactionByHash, useGetMevBlockByNumber } from '@/hooks/useMev';
import { cn, formatDate, formatAddress } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHeader() {
  const { toggle } = useMenuSidebar();
  const { isOpen } = useMenuSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [showTransactionResult, setShowTransactionResult] = useState(false);
  const [showBlockResult, setShowBlockResult] = useState(false);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const isUsingTransaction = searchTerm.length === 66;
  
  const { data: transactionData, isLoading: isTransactionLoading } = useGetMevTransactionByHash(
    isUsingTransaction ? searchTerm : ''
  );
  
  const { data: blocksData, isLoading: isBlocksLoading } = useGetMevBlockByNumber(
    !isUsingTransaction && searchTerm ? Number(searchTerm) : 0
  );
  
  useEffect(() => {
    if (blocksData) {
      setShowBlockResult(true);
    }
  }, [blocksData]);
  
  useEffect(() => {
    if (transactionData) {
      setShowTransactionResult(true);
    }
  }, [transactionData]);
  
  const isLoading = isUsingTransaction ? isTransactionLoading : isBlocksLoading;
  
  const apiResponse = React.useMemo(() => {
    if (isUsingTransaction && transactionData) {
      return transactionData;
    } else if (!isUsingTransaction && blocksData?.block) {
      const blockData = blocksData.block;
      return {
        id: blockData.hash,
        hash: blockData.hash,
        blockNumber: blockData.number,
        timestamp: blockData.timestamp,
        time: blockData.timestamp,
        label: null,
        from: '',
        to: '',
        profit: null
      };
    }
    return null;
  }, [isUsingTransaction, transactionData, blocksData]);

  const hasBlockTransactions = React.useMemo(() => {
    if (!isUsingTransaction && blocksData) {
      return true; 
    }
    return false;
  }, [isUsingTransaction, blocksData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsResultVisible(false);
        setShowTransactionResult(false);
        setShowBlockResult(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isResultVisible) {
      setSearchTerm('');
      setShowTransactionResult(false);
      setShowBlockResult(false);
    }
  }, [isResultVisible]);

  // Kiểm tra xem MetaMask đã được cài đặt chưa
  useEffect(() => {
    const checkIfMetaMaskIsInstalled = async () => {
      try {
        const { ethereum } = window as any;
        if (ethereum && ethereum.isMetaMask) {
          // MetaMask đã được cài đặt
          // Kiểm tra xem người dùng đã kết nối trước đó chưa
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }

          // Lắng nghe sự kiện thay đổi tài khoản
          ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              // Người dùng đã ngắt kết nối
              setAccount('');
            } else {
              // Người dùng đã chuyển đổi tài khoản
              setAccount(newAccounts[0]);
            }
          });
        }
      } catch (error) {
        console.error("Không thể kết nối với MetaMask:", error);
      }
    };

    checkIfMetaMaskIsInstalled();

    // Cleanup listener khi component unmount
    return () => {
      const { ethereum } = window as any;
      if (ethereum && ethereum.isMetaMask) {
        ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
      }

      // Yêu cầu kết nối với tài khoản
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Lỗi kết nối với MetaMask:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setIsSearching(true);
      setIsResultVisible(true);
      setShowTransactionResult(false);
      setShowBlockResult(false);
    } else {
      setIsResultVisible(false);
      setShowTransactionResult(false);
      setShowBlockResult(false);
    }
  };


  const getLabelStyles = (label: string) => {
    switch (label) {
      case "ARBITRAGE":
        return "bg-green-500/20 text-green-400";
      case "LIQUIDATION":
        return "bg-red-500/20 text-red-400";
      case "SANDWICH":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
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
              onFocus={() => searchTerm.length > 0 && setIsResultVisible(true)}
            />
            {account ? (
              <button
                onClick={disconnectWallet}
                type="button"
                className="flex items-center space-x-1 px-3 py-2 rounded-sm bg-mainCardV1 transition-colors hover:bg-mainActiveV1/10">
                <Icon path={mdiEthereum} size={0.7} className="text-mainActiveV1" />
                <span className="text-sm text-mainActiveV1">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                type="button"
                disabled={isConnecting}
                className="flex items-center space-x-1 px-3 py-2 rounded-sm bg-mainCardV1 transition-colors hover:bg-mainActiveV1/10">
                <Icon path={mdiWalletPlus} size={0.7} className="text-mainActiveV1" />
                <span className="text-sm text-mainActiveV1">
                  {isConnecting ? "Đang kết nối..." : "Connect Wallet"}
                </span>
              </button>
            )}
          </form>

          {isResultVisible && !isLoading && searchTerm.length > 0 && 
           !showTransactionResult && !showBlockResult && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 p-4"
            >
              <div className="flex flex-col items-center justify-center py-2">
                <Icon path={mdiRobotVacuumAlert} size={1} className="text-mainGrayV1 mb-2" />
                <p className="text-mainGrayV1 text-center">No matching results found!</p>
              </div>
            </div>
          )}

          {isResultVisible && isLoading && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 overflow-y-auto max-h-[400px]"
            >
              {/* Skeleton Loading */}
              <div className="p-4 border-b border-mainBorderV1">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="mt-1 flex justify-between">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[80px] rounded-full" />
                </div>
                <div className="mt-1 flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="mt-1">
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
              <div className="p-4 border-b border-mainBorderV1">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="mt-1 flex justify-between">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[80px] rounded-full" />
                </div>
              </div>
            </div>
          )}

          {isResultVisible && !isLoading && isUsingTransaction && showTransactionResult && transactionData && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 overflow-y-auto p-4"
            >
              <Link href={
                transactionData.label === "ARBITRAGE" 
                  ? `/mev/ethereum/arbitrage/tx/${searchTerm}`
                  : transactionData.label === "LIQUIDATION" 
                    ? `/mev/ethereum/liquidation/tx/${searchTerm}`
                    : transactionData.label === "SANDWICH" 
                      ? `/mev/ethereum/sandwich/tx/${searchTerm}`
                      : `/mev/ethereum/tx/${searchTerm}`
              }
                className="hover:bg-mainActiveV1/10 cursor-pointer border-b border-mainBorderV1"
                onClick={() => {
                  setIsResultVisible(false);
                  setShowTransactionResult(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-mainActiveV1 font-medium truncate max-w-[250px]">
                    {transactionData.hash || transactionData.id}
                  </div>
                  <div className="text-xs text-mainGrayV1">
                    {formatDate(transactionData.timestamp || transactionData.time || '')}
                  </div>
                </div>
                <div className="mt-1 flex justify-between">
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-mainGrayV1">Block:</span>
                    <span className='text-white'>{transactionData.blockNumber}</span>
                  </div>
                  {transactionData.label && (
                    <div className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      getLabelStyles(transactionData.label || "")
                    )}>
                      {transactionData.label || "NORMAL"}
                    </div>
                  )}
                </div>
                <div className="mt-1 text-sm flex justify-between">
                  <div className='flex items-center gap-1'>
                    <span className="text-mainGrayV1">From:</span>
                    <span className='text-white'>{formatAddress(transactionData.from)}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className="text-mainGrayV1">To:</span>
                    <span className='text-white'>{formatAddress(transactionData.to)}</span>
                  </div>
                </div>
                {transactionData.profit && (
                  <div className="mt-1 text-sm flex items-center gap-1">
                    <span className="text-mainGrayV1">Profit:</span>
                    <span className='text-white'>{parseFloat(transactionData.profit).toFixed(4)} ETH</span>
                  </div>
                )}
              </Link>
            </div>
          )}

          {isResultVisible && !isLoading && !isUsingTransaction && apiResponse && !showBlockResult && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 overflow-y-auto p-4"
            >
              <Link href={`/mev/ethereum/blocks/${apiResponse.blockNumber}`}
                className="hover:bg-mainActiveV1/10 cursor-pointer border-b border-mainBorderV1"
                onClick={() => setIsResultVisible(false)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-mainActiveV1 font-medium truncate max-w-[250px]">
                    {apiResponse.hash}
                  </div>
                  <div className="text-xs text-mainGrayV1">
                    {formatDate(apiResponse.timestamp || apiResponse.time || '')}
                  </div>
                </div>
                <div className="mt-1 flex justify-between">
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-mainGrayV1">Block:</span>
                    <span className='text-white'>{apiResponse.blockNumber}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {isResultVisible && !isLoading && showBlockResult && (
            <div
              ref={searchResultRef}
              className="absolute w-full mt-2 bg-mainCardV1 rounded-md shadow-lg border border-mainBorderV1 z-50 overflow-y-auto max-h-[400px]"
            >
              <div className="p-3 border-b border-mainBorderV1">
                <div
                  onClick={() => {
                    setIsResultVisible(false);
                    setShowBlockResult(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-mainActiveV1 font-medium truncate max-w-[250px]">
                      Block: {blocksData?.block?.number}
                    </div>
                    <div className="text-xs text-mainGrayV1">
                      {formatDate(blocksData?.block?.timestamp || '')}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-mainGrayV1 text-sm">Hash:</span>
                    <span className='text-white text-sm'>{formatAddress(blocksData?.block?.hash || '')}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-mainGrayV1 text-sm">Transactions:</span>
                    <span className='text-white text-sm'>{blocksData?.transactions ? blocksData.transactions.length : 0}</span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-2 border-b border-mainBorderV1 bg-mainBackgroundV1/40">
                <p className="text-mainGrayV1 text-sm font-medium">Transactions in block</p>
              </div>

              {blocksData?.transactions && blocksData.transactions.map((tx: any) => (
                <div key={tx.hash} className="p-3 border-b border-mainBorderV1 hover:bg-mainActiveV1/10">
                  <Link href={
                    tx.label === "ARBITRAGE" 
                      ? `/mev/ethereum/arbitrage/tx/${tx.hash}`
                      : tx.label === "LIQUIDATION" 
                        ? `/mev/ethereum/liquidation/tx/${tx.hash}`
                        : tx.label === "SANDWICH" 
                          ? `/mev/ethereum/sandwich/tx/${tx.hash}`
                          : `/mev/ethereum/tx/${tx.hash}`
                  }
                    className="cursor-pointer"
                    onClick={() => {
                      setIsResultVisible(false);
                      setShowBlockResult(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-mainActiveV1 font-medium truncate max-w-[250px]">
                        {formatAddress(tx.hash)}
                      </div>
                      <div className="text-xs text-mainGrayV1">
                        {formatDate(tx.timestamp || '')}
                      </div>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <div className="text-sm flex items-center gap-1">
                        <span className="text-mainGrayV1">Index:</span>
                        <span className='text-white'>{tx.index}</span>
                      </div>
                      {tx.label && (
                        <div className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          getLabelStyles(tx.label || "")
                        )}>
                          {tx.label || "NORMAL"}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-sm flex justify-between">
                      <div className='flex items-center gap-1'>
                        <span className="text-mainGrayV1">From:</span>
                        <span className='text-white'>{formatAddress(tx.from)}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <span className="text-mainGrayV1">To:</span>
                        <span className='text-white'>{formatAddress(tx.to)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 