'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import {
  mdiEthereum,
  mdiWalletPlus,
  mdiRobotVacuumAlert,
  mdiAlertCircleOutline,
  mdiClose,
  mdiOpenInNew
} from '@mdi/js';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { useGetMevTransactionByHash, useGetMevBlockByNumber, useGetMevByAddress } from '@/hooks/useMev';
import { cn, formatDate, formatAddress } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ethers } from "ethers";
import { useAddress } from "@/stores/useAddress";

declare global {
  interface Window {
    ethereum?: any
  }
}

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
  const { account, setAccount } = useAddress();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  // const { data } = useGetMevByAddress(account || '0x1f2f10d1c40777ae1da742455c65828ff36df387');
  const { data } = useGetMevByAddress('0x1f2f10d1c40777ae1da742455c65828ff36df387');
  console.log(data);
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

  // Kiểm tra xem MetaMask đã được cài đặt chưa và kết nối nếu đã được cài đặt
  useEffect(() => {
    const checkIfMetaMaskIsConnected = async () => {
      try {
        // Cho phép thời gian để extension MetaMask được inject vào window
        setTimeout(async () => {
          if (window.ethereum) {
            try {
              const provider = new ethers.BrowserProvider(window.ethereum);
              const accounts = await provider.listAccounts();
              
              if (accounts.length > 0) {
                setAccount(accounts[0].address);
              }
              
              // Lắng nghe sự kiện thay đổi tài khoản
              window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
                if (newAccounts.length === 0) {
                  setAccount('');
                } else {
                  // Cập nhật với tài khoản mới
                  const provider = new ethers.BrowserProvider(window.ethereum);
                  const signer = await provider.getSigner();
                  const address = await signer.getAddress();
                  setAccount(address);
                }
              });
            } catch (err) {
              console.error("Lỗi khi kiểm tra tài khoản MetaMask:", err);
            }
          }
        }, 500); // Đợi 500ms để đảm bảo MetaMask đã inject
      } catch (error) {
        console.error("Không thể kết nối với MetaMask:", error);
      }
    };

    checkIfMetaMaskIsConnected();

    // Cleanup listener khi component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Kiểm tra MetaMask một cách kỹ lưỡng hơn
      if (typeof window.ethereum === 'undefined') {
        setShowMetaMaskModal(true);
        setIsConnecting(false);
        return;
      }
      
      // Kiểm tra xem MetaMask có phải là provider chính không
      const isMetaMask = window.ethereum.isMetaMask;
      if (!isMetaMask) {
        setShowMetaMaskModal(true);
        setIsConnecting(false);
        return;
      }
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Yêu cầu kết nối với tài khoản
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        console.log(accounts);
        
        if (accounts && accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
        } else {
          console.error("Không có tài khoản nào được chọn");
        }
      } catch (err: any) {
        // Xử lý trường hợp người dùng từ chối kết nối
        if (err.code === 4001) {
          console.log("Người dùng từ chối kết nối với MetaMask");
        } else {
          console.error("Lỗi khi kết nối với MetaMask:", err);
        }
      }
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
    <>
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

      {/* Modal hướng dẫn cài đặt MetaMask */}
      {showMetaMaskModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000]">
          <div className="bg-mainCardV1 rounded-lg p-6 max-w-md w-full border border-mainBorderV1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Icon path={mdiAlertCircleOutline} size={1} className="text-mainActiveV1 mr-2" />
                MetaMask chưa được cài đặt
              </h3>
              <button 
                onClick={() => setShowMetaMaskModal(false)}
                className="text-mainGrayV1 hover:text-white"
              >
                <Icon path={mdiClose} size={1} />
              </button>
            </div>
            
            <div className="text-mainGrayV1 mb-6">
              <p className="mb-3">Bạn cần cài đặt tiện ích mở rộng MetaMask để kết nối ví của bạn với ứng dụng.</p>
              <p className="mb-3">Các bước cài đặt:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Truy cập trang web chính thức của MetaMask</li>
                <li>Tải xuống tiện ích mở rộng cho trình duyệt của bạn</li>
                <li>Làm theo hướng dẫn để thiết lập ví MetaMask</li>
                <li>Làm mới trang này sau khi cài đặt hoàn tất</li>
              </ol>
            </div>
            
            <div className="flex justify-center">
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-mainActiveV1 text-black px-4 py-2 rounded-md flex items-center hover:bg-mainActiveV1/90 transition-colors"
              >
                <span className="mr-2">Cài đặt MetaMask</span>
                <Icon path={mdiOpenInNew} size={0.8} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 