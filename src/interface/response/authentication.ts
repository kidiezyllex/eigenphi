export interface IAuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface IUser {
  id: string
  username: string
  email: string
  fullName?: string
  phone?: string
  address?: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface IBankInfo {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  branch?: string
}

export interface IBank {
  id: string
  name: string
  code: string
  logo?: string
}

export interface IProfileResponse {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  employeeId: string;
  projects: any[];
  tasks: any[];
  documents: any[];
}

export interface IBankListResponse {
  message: string
  statusCode: number
  data: {
    banks: IBank[]
  }
}

export interface ISpreadPackageHistoryItem {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  userId: string
  spreadPackageId: string
  price: number
  duration: number
  expiryDate: string
  status: string
  spreadPackage: {
    id: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    name: string
    price: number
    description: string
    image: string
    isActive: boolean
    duration: number
  }
}

export interface IPaginationMeta {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ISpreadPackageHistoryResponse {
  status: boolean
  message: string
  data: {
    data: ISpreadPackageHistoryItem[]
    meta: IPaginationMeta
  }
  errors: null | any // Hoặc định nghĩa kiểu lỗi cụ thể nếu có
  timestamp: string
}

export interface IPackage {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  name: string
  price: number
  description: string
  image: string
  isActive: boolean
  duration: number
  percentProfit: number
  maxProducts: number
}

export interface IPackageHistoryItem {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  expiryDate: string
  status: string
  amountPaid: number
  package: IPackage // Sử dụng interface IPackage vừa tạo
}

export interface IPackageHistoryResponse {
  status: boolean
  message: string
  data: {
    data: IPackageHistoryItem[]
    meta: IPaginationMeta // Sử dụng interface IPaginationMeta dùng chung
  }
  errors: null | any
  timestamp: string
}

