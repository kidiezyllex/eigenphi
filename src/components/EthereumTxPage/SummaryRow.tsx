import React, { useState } from 'react'
import { formatValue } from './utils'
import CopyButton from './CopyButton'
import AddressLink from './AddressLink'
import TransactionLink from './TransactionLink'
import { message } from 'antd';

interface SummaryRowProps {
  label: string;
  value: any;
  isLast: boolean;
  sandwichData?: any; // Dữ liệu giao dịch sandwich nếu có
}

// Định dạng hiển thị cho các trường
const formatFieldValue = (label: string, value: any): React.ReactNode => {
  if (value === undefined || value === null) return '-';

  // Chuyển đổi label sang lowercase để so sánh dễ dàng
  const fieldName = label.toLowerCase();

  // Xử lý các trường đặc biệt
  switch (fieldName) {
    case 'profit':
    case 'lợi nhuận':
    case 'cost':
    case 'chi phí':
    case 'revenue':
    case 'doanh thu':
      // Xử lý giá trị số hoặc chuỗi
      if (typeof value === 'number') {
        return `${value.toFixed(6)} ETH`;
      } else if (typeof value === 'string') {
        // Kiểm tra nếu chuỗi đã chứa "ETH"
        if (value.includes('ETH')) {
          return value;
        }
        
        // Thử chuyển đổi chuỗi thành số
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return `${num.toFixed(6)} ETH`;
        }
        return `${value} ETH`;
      }
      return `${value} ETH`;
      
    case 'gasprice':
    case 'giá gas':
      return `${value} Gwei`;
      
    case 'blocknumber':
    case 'số khối':
    case 'chỉ số':
    case 'index':
      return Number(value).toString();
      
    case 'liquidatedamount':
    case 'số lượng thanh lý':
    case 'debttocover':
    case 'nợ cần trả':
      if (typeof value === 'number') {
        return value.toFixed(6);
      }
      return value;
      
    case 'time':
    case 'thời gian':
    case 'timestamp':
      try {
        const date = new Date(value);
        return date.toLocaleString('vi-VN');
      } catch (e) {
        return value;
      }
      
    default:
      return value;
  }
};

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isLast, sandwichData }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      message.success(`Đã sao chép ${text} vào clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('Sao chép thất bại.');
    }
  };
  
  const formattedValue = formatFieldValue(label, value);
  
  // Xác định ghi chú của trường (nếu cần)
  const getFieldNote = (label: string): string => {
    switch (label.toLowerCase()) {
      case 'profit':
        return 'Estimated profit';
      case 'cost':
        return 'Transaction cost';
      case 'revenue':
        return 'Total revenue';
      case 'blocknumber':
      case 'block number':
        return 'Block number containing the transaction';
      case 'liquidator':
        return 'Liquidator address';
      case 'borrower':
        return 'Borrower address';
      default:
        return '';
    }
  };

  const fieldNote = getFieldNote(label);
  
  const isAddress = typeof value === 'string' && value.startsWith('0x') && value.length === 42;
  const isTransactionHash = typeof value === 'string' && value.startsWith('0x') && value.length === 66;
  
  if (label.toLowerCase() === 'Transaction Type' && value === 'SANDWICH' && sandwichData) {
    return (
      <tr className={`border-b ${isLast ? 'border-transparent' : 'border-mainBorderV1'}`}>
        <td className="py-3 px-4 text-sm text-gray-400">{label}</td>
        <td className="py-3 px-4 text-right">
          <div className="bg-mainCardV1 p-3 rounded-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Loại:</span>
                <span className="text-sm font-medium bg-mainActiveV1/20 text-mainActiveV1 px-2 py-0.5 rounded">SANDWICH</span>
              </div>
              {sandwichData.profit !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Lợi nhuận:</span>
                  <span className="text-sm text-green-400">{formatFieldValue("profit", sandwichData.profit)}</span>
                </div>
              )}
              {sandwichData.cost !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Chi phí:</span>
                  <span className="text-sm text-red-400">{formatFieldValue("cost", sandwichData.cost)}</span>
                </div>
              )}
              {sandwichData.revenue !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Doanh thu:</span>
                  <span className="text-sm text-blue-400">{formatFieldValue("revenue", sandwichData.revenue)}</span>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (label.toLowerCase() === 'transaction type') {
    return (
      <tr className={`border-b ${isLast ? 'border-transparent' : 'border-mainBorderV1'}`}>
        <td className="py-3 px-4 text-sm text-gray-400">{label}</td>
        <td className="py-3 px-4 text-right">
          <span className="text-sm  font-medium bg-mainActiveV1/20 text-mainActiveV1 px-2 py-0.5 rounded">
            {value}
          </span>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`border-b ${isLast ? 'border-transparent' : 'border-mainBorderV1'}`}>
      <td className="py-3 px-4 text-sm text-gray-400">{label}</td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-1">
          {isAddress ? (
            <div className="flex items-center space-x-2">
              <AddressLink address={value} shorten={true} />
              <CopyButton text={value} onCopy={handleCopy} copied={copied} />
            </div>
          ) : isTransactionHash ? (
            <div className="flex items-center space-x-2">
              <TransactionLink hash={value} shorten={true} />
              <CopyButton text={value} onCopy={handleCopy} copied={copied} />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm text-white">{formattedValue}</span>
              {fieldNote && (
                <span className="text-xs text-gray-500 ml-2">({fieldNote})</span>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SummaryRow; 