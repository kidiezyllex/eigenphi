'use client'

import React, { useState, useEffect } from 'react'
import { useGetMevByAddress } from '@/hooks/useMev'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import Icon from '@mdi/react'
import { mdiEthereum, mdiOpenInNew, mdiUnfoldMoreHorizontal } from '@mdi/js'
import { Pagination } from '@/components/ui/pagination'
import { message } from 'antd'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import CopyButton from '@/components/EthereumTxPage/CopyButton'
import { Skeleton } from '@/components/ui/skeleton'

interface Transaction {
    hash: string
    blockNumber: number
    from: string
    to: string
    gasPrice: string
    gasUsed: string
    timestamp: string
    label: string
    index: number
}

const Portfolio = () => {
    const [isConnected, setIsConnected] = useState<boolean>(true)
    const { data, isLoading, error } = useGetMevByAddress(isConnected ? '0x1f2f10d1c40777ae1da742455c65828ff36df387' : '')
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const [sortedTransactions, setSortedTransactions] = useState<Transaction[] | undefined>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageSize = 50 // 50 items per page
    const [sortBy, setSortBy] = useState<'timestamp' | 'blockNumber' | 'index'>('timestamp')
    const [copied, setCopied] = useState<string | null>(null);
    
    useEffect(() => {
        const handleDisconnectEvent = () => {
            setIsConnected(false);
        };
        
        const handleConnectEvent = () => {
            setIsConnected(true);
        };
        
        window.addEventListener('wallet-disconnect', handleDisconnectEvent);
        window.addEventListener('wallet-connect', handleConnectEvent);
        
        return () => {
            window.removeEventListener('wallet-disconnect', handleDisconnectEvent);
            window.removeEventListener('wallet-connect', handleConnectEvent);
        };
    }, []);
    
    const handleCopy = async (text: string, index: number) => {
        console.log(`Copying text: ${text} at index: ${index}`);
        try {
            await navigator.clipboard.writeText(text);
            setCopied(text);
            message.success(`Đã sao chép ${text} vào clipboard!`);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            message.error('Sao chép thất bại.');
        }
    };
    useEffect(() => {
        if (data) {
            setSortedTransactions(sortData(data as any, sortBy, sortDirection))
        }
    }, [data, sortBy, sortDirection])

    const sortData = (data: Transaction[], sortField: string, direction: 'asc' | 'desc') => {
        return [...data].sort((a, b) => {
            let valueA, valueB

            if (sortField === 'timestamp') {
                valueA = new Date(a.timestamp).getTime()
                valueB = new Date(b.timestamp).getTime()
            } else {
                valueA = a[sortField as keyof Transaction]
                valueB = b[sortField as keyof Transaction]
            }

            if (direction === 'asc') {
                return valueA > valueB ? 1 : -1
            } else {
                return valueA < valueB ? 1 : -1
            }
        })
    }

    const handleSort = (field: 'timestamp' | 'blockNumber' | 'index') => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortDirection('desc')
        }
    }

    const getCurrentPageData = () => {
        if (!sortedTransactions) return []
        const startIndex = (currentPage - 1) * pageSize
        return sortedTransactions.slice(startIndex, startIndex + pageSize)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const formatGasPrice = (gasPrice: string) => {
        const gasPriceInGwei = parseInt(gasPrice) / 1e9
        return `${gasPriceInGwei.toFixed(2)} Gwei`
    }

    const formatTimeAgo = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: vi })
        } catch (error) {
            return 'Unknown'
        }
    }

    const getBadgeColor = (label: string) => {
        switch (label) {
            case 'SANDWICH':
                return 'bg-amber-700 text-white'
            case 'ARBITRAGE':
                return 'bg-green-700 text-white'
            default:
                return 'bg-gray-700 text-white'
        }
    }

    if (isLoading) {
        return (
            <div className='p-6'>
                <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center">
                            <Skeleton className="h-5 w-[150px]" />
                            <Skeleton className="ml-1 h-4 w-4 rounded-full" />
                        </div>
                        <Skeleton className="h-7 w-7" />
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto max-w-full">
                            <table className="w-full border-collapse min-w-full table-fixed">
                                <thead className="bg-mainCardV1">
                                    <tr>
                                        <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                            <div className="flex items-center space-x-1">
                                                <Icon path={mdiEthereum} size={0.7} />
                                                <span>Hash</span>
                                            </div>
                                        </th>
                                        <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[10%]">
                                            <div className="flex items-center justify-center space-x-1 w-full">
                                                <span>Block</span>
                                                <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                            </div>
                                        </th>
                                        <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                            <span>From</span>
                                        </th>
                                        <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                            <span>To</span>
                                        </th>
                                        <th className="py-2 px-3 text-right text-gray-400 text-xs font-medium w-[10%]">
                                            <span>Gas Price</span>
                                        </th>
                                        <th className="py-2 px-3 text-right text-gray-400 text-xs font-medium w-[10%]">
                                            <span>Gas Used</span>
                                        </th>
                                        <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[15%]">
                                            <div className="flex items-center justify-center space-x-1 w-full">
                                                <span>Time</span>
                                                <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                            </div>
                                        </th>
                                        <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[5%]">
                                            <span>Type</span>
                                        </th>
                                        <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[5%]">
                                            <div className="flex items-center justify-center space-x-1 w-full">
                                                <span>Index</span>
                                                <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <tr key={index} className="border-b border-mainBorderV1">
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-[50px] rounded-full" /></td>
                                            <td className="py-2 px-3"><Skeleton className="h-4 w-[30px]" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex items-center justify-between mt-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-8 w-[200px]" />
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!isConnected || error || !data || data.length === 0) {
        return (
            <div className='p-6'>
                <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center">
                            <CardTitle className="text-sm font-bold text-white">MEV Transaction List</CardTitle>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="ml-1">
                                            <IconInfoCircle className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="w-[200px] text-xs">
                                            {!isConnected 
                                                ? "Vui lòng kết nối để xem danh sách giao dịch MEV." 
                                                : "Không tìm thấy giao dịch MEV nào cho địa chỉ này."}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
                            <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 flex justify-center items-center">
                        <p className="text-gray-400">
                            {!isConnected 
                                ? "Vui lòng kết nối để xem danh sách giao dịch MEV." 
                                : "Không tìm thấy giao dịch MEV nào cho địa chỉ này."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='p-6'>
            <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center">
                        <CardTitle className="text-sm font-bold text-white">MEV Transaction List</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="ml-1">
                                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-[200px] text-xs">Details about MEV transactions</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
                        <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto max-w-full">
                        <table className="w-full border-collapse min-w-full table-fixed">
                            <thead className="bg-mainCardV1">
                                <tr>
                                    <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                        <div className="flex items-center space-x-1">
                                            <Icon path={mdiEthereum} size={0.7} />
                                            <span>Hash</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[10%]">
                                        <button
                                            className="flex items-center justify-center space-x-1 w-full cursor-pointer"
                                            onClick={() => handleSort('blockNumber')}
                                        >
                                            <span>Block</span>
                                            <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                        </button>
                                    </th>
                                    <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                        <div className="flex items-center space-x-1">
                                            <span>From</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-left text-gray-400 text-xs font-medium w-[15%]">
                                        <div className="flex items-center space-x-1">
                                            <span>To</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-right text-gray-400 text-xs font-medium w-[10%]">
                                        <div className="flex items-center justify-end space-x-1">
                                            <span>Gas Price</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-right text-gray-400 text-xs font-medium w-[10%]">
                                        <div className="flex items-center justify-end space-x-1">
                                            <span>Gas Used</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[15%]">
                                        <button
                                            className="flex items-center justify-center space-x-1 w-full cursor-pointer"
                                            onClick={() => handleSort('timestamp')}
                                        >
                                            <span>Time</span>
                                            <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                        </button>
                                    </th>
                                    <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[5%]">
                                        <div className="flex items-center justify-center space-x-1">
                                            <span>Type</span>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-center text-gray-400 text-xs font-medium w-[5%]">
                                        <button
                                            className="flex items-center justify-center space-x-1 w-full cursor-pointer"
                                            onClick={() => handleSort('index')}
                                        >
                                            <span>Index</span>
                                            <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageData().map((tx, index) => (
                                    <tr key={index} className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                                        <td className="py-2 px-3">
                                            <div className="flex items-center space-x-1">
                                                <Link
                                                    href={`/mev/ethereum/tx/${tx.hash}`}
                                                    className="text-xs text-mainActiveV1 hover:underline truncate"
                                                >
                                                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                                </Link>
                                                <CopyButton text={tx.hash} onCopy={(text) => handleCopy(text, index)} copied={copied === tx.hash} />
                                                <a
                                                    href={`https://etherscan.io/tx/${tx.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-mainActiveV1"
                                                >
                                                    <Icon path={mdiOpenInNew} size={0.5} />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <Link
                                                href={`/mev/ethereum/block/${tx.blockNumber}`}
                                                className="text-xs text-mainActiveV1 hover:underline"
                                            >
                                                {tx.blockNumber}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-3">
                                            <div className="flex items-center space-x-1">
                                                <Link
                                                    href={`/mev/ethereum/address/${tx.from}`}
                                                    className="text-xs text-white hover:text-mainActiveV1 truncate"
                                                >
                                                    {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                                                </Link>
                                                <CopyButton text={tx.from} onCopy={(text) => handleCopy(text, index)} copied={copied === tx.from} />

                                            </div>
                                        </td>
                                        <td className="py-2 px-3">
                                            <div className="flex items-center space-x-1">
                                                <Link
                                                    href={`/mev/ethereum/address/${tx.to}`}
                                                    className="text-xs text-white hover:text-mainActiveV1 truncate"
                                                >
                                                    {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                                                </Link>
                                                <CopyButton text={tx.to} onCopy={(text) => handleCopy(text, index)} copied={copied === tx.to} />

                                            </div>
                                        </td>
                                        <td className="py-2 px-3 text-right">
                                            <span className="text-xs text-white">
                                                {formatGasPrice(tx.gasPrice)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-right">
                                            <span className="text-xs text-white">
                                                {tx.gasUsed}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="text-xs text-gray-400">
                                                            {formatTimeAgo(tx.timestamp)}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-xs">{new Date(tx.timestamp).toLocaleString('vi-VN')}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(tx.label)}`}>
                                                {tx.label}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <span className="text-xs text-white">{tx.index}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="w-full flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-400">
                            <span>
                                Total: {data.length} transactions
                            </span>
                        </div>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={data.length}
                            onChange={handlePageChange}
                        />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Portfolio 