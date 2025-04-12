export interface IBaseResponse<T> {
  status: boolean
  message: string
  data: T
  errors: null | any
  timestamp: string
}

export interface IAuthData {
  _id: string
  username: string
  fullName: string
  email: string
  password: string
  role: string
  token: string
}

export interface IAuthResponse extends IBaseResponse<IAuthData> {}

export interface IProfileData {
  _id: string
  username: string
  fullName: string
  email: string
  role: string
  avatar: string
  department: string
  position: string
  skills: any[]
  bio: string
  joinDate: string
  createdAt: string
  updatedAt: string
  employeeId: string
  __v: number
}

export interface IProfileResponse extends IBaseResponse<IProfileData> {}

