"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner';
import { useUser } from "@/context/useUserContext"
import { useSignIn, useRegister } from "@/hooks/authentication"
import { UserRole } from "@/interface/common"

const loginSchema = z.object({
  username: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  name: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  role: z.enum([
    UserRole.ADMIN,
    UserRole.DESIGNER,
  ]),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const signInMutation = useSignIn()
  const { loginUser } = useUser()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await signInMutation.mutateAsync(data)
      if (response && response.token) {
        loginUser(response.user, response.token)
        toast.success("Đăng nhập thành công", {
          description: "Chào mừng bạn quay trở lại!",
        })
        onSuccess()
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error)
      toast.error("Đăng nhập thất bại", {
        description: error.message || "Đã xảy ra lỗi khi đăng nhập",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập email của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>
    </Form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const registerMutation = useRegister()
  const { loginUser } = useUser()
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: UserRole.DESIGNER,
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Chuyển đổi dữ liệu từ form sang dạng yêu cầu của API
      const registerData = {
        username: data.email,
        email: data.email,
        fullName: data.name,
        password: data.password,
        employeeId: `EMP-${Math.floor(Math.random() * 10000)}`, // Tạo ID nhân viên ngẫu nhiên
        role: data.role
      } as any // Dùng type assertion tạm thời

      const response = await registerMutation.mutateAsync(registerData)
      if (response && response.token) {
        loginUser(response.user, response.token)
        toast.success("Đăng ký thành công", {
          description: "Tài khoản của bạn đã được tạo!",
        })
        onSuccess()
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error)
      toast.error("Đăng ký thất bại", {
        description: error.message || "Đã xảy ra lỗi khi đăng ký",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ tên đầy đủ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Tạo mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
                  <SelectItem value={UserRole.DESIGNER}>Thiết kế</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [redirect, setRedirect] = useState(false)
  const { profile } = useUser()

  useEffect(() => {
    if (profile) {
      setRedirect(true)
    }
  }, [profile])

  useEffect(() => {
    if (redirect) {
      router.push("/dashboard")
    }
  }, [redirect, router])

  if (redirect) {
    return null
  }

  const handleSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2">
        {/* Phần giới thiệu bên trái */}
        <div className="flex flex-col justify-center p-6">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-green-500">
            Wido<span className="text-[#F2A024]">File</span>
          </h1>
          <h2 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Quản lý dự án game chuyên nghiệp
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Nền tảng quản lý tài liệu và quy trình làm việc cho các đội ngũ phát triển game. Thiết kế đặc biệt cho quy
            trình làm việc trên nhiều vai trò khác nhau.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-green-700 dark:text-green-400">Quản lý tài liệu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lưu trữ, phiên bản, và duyệt tài liệu dự án</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-green-700 dark:text-green-400">Phân vai trò</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phân quyền chi tiết cho từng vai trò trong đội</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-green-700 dark:text-green-400">Theo dõi tiến độ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Giám sát trạng thái và tiến độ dự án</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-green-700 dark:text-green-400">Quy trình kiểm thử</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quản lý test case và báo cáo lỗi</p>
            </div>
          </div>
        </div>

        {/* Form đăng nhập/đăng ký bên phải */}
        <div className="flex items-center">
          <ScrollArea className="h-[540px] w-full">
            <Card className="flex flex-col w-full h-full shadow-lg">
              <CardHeader>
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                    <TabsTrigger value="register">Đăng ký</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="pt-4">
                    <CardTitle>Đăng nhập</CardTitle>
                    <CardDescription>Đăng nhập để quản lý dự án game của bạn</CardDescription>
                  </TabsContent>

                  <TabsContent value="register" className="pt-4">
                    <CardTitle>Đăng ký tài khoản mới</CardTitle>
                    <CardDescription>Tạo tài khoản để bắt đầu sử dụng WidoFile</CardDescription>
                  </TabsContent>
                </Tabs>
              </CardHeader>

              <CardContent className="flex-1">
                {activeTab === "login" ? (
                  <LoginForm onSuccess={handleSuccess} />
                ) : (
                  <RegisterForm onSuccess={handleSuccess} />
                )}
              </CardContent>

              <CardFooter className="flex justify-center text-sm text-gray-500">
                {activeTab === "login" ? (
                  <p>
                    Chưa có tài khoản?{" "}
                    <span className="font-medium text-green-600 cursor-pointer" onClick={() => setActiveTab("register")}>
                      Đăng ký ngay
                    </span>
                  </p>
                ) : (
                  <p>
                    Đã có tài khoản?{" "}
                    <span className="font-medium text-green-600 cursor-pointer" onClick={() => setActiveTab("login")}>
                      Đăng nhập ngay
                    </span>
                  </p>
                )}
              </CardFooter>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}