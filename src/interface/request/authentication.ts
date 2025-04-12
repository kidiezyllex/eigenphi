export interface ISignIn {
  username: string
  password: string
}

export interface IRegister {
  username: string
  fullName: string
  email: string
  password: string
  role?: string
}
