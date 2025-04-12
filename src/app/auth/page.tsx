"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner';
import { useUser } from "@/context/useUserContext"
import { useSignIn } from "@/hooks/authentication"
import { motion } from "framer-motion"

const loginSchema = z.object({
  username: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type LoginFormValues = z.infer<typeof loginSchema>

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 h-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Nhập email của bạn" 
                  {...field} 
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
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
              <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Mật khẩu</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Nhập mật khẩu" 
                  {...field} 
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <a href="#" className="text-sm text-primary hover:text-secondary transition-colors duration-300">
            Quên mật khẩu?
          </a>
        </div>
        <div className="flex justify-center flex-1 h-full items-end mt-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-secondary transition-all duration-300 text-base font-semibold w-full py-6"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default function AuthPage() {
  const router = useRouter()
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
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hiệu ứng bong bóng trang trí */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute h-20 w-20 rounded-full bg-primary/70 top-12 left-[10%]"></div>
        <div className="absolute h-24 w-24 rounded-full bg-secondary/80 top-36 right-[15%]"></div>
        <div className="absolute h-16 w-16 rounded-full bg-primary/40 bottom-10 left-[20%]"></div>
        <div className="absolute h-32 w-32 rounded-full bg-secondary/70 -bottom-10 right-[25%]"></div>
        <div className="absolute h-28 w-28 rounded-full bg-primary/70 -top-10 left-[40%]"></div>
        <div className="absolute h-12 w-12 rounded-full bg-secondary/40 top-1/2 left-[5%]"></div>
        <div className="absolute h-14 w-14 rounded-full bg-primary/80 bottom-1/3 right-[10%]"></div>
        <div className="absolute h-10 w-10 rounded-full bg-secondary/70 top-1/4 right-[30%]"></div>
        <div className="absolute h-36 w-36 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 -bottom-16 left-[30%] blur-sm"></div>
        <div className="absolute h-40 w-40 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 -top-20 right-[20%] blur-sm"></div>
      </div>

      <div className="w-full max-w-6xl gap-8 grid md:grid-cols-2 items-stretch relative z-10">
        {/* Phần giới thiệu bên trái */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center p-6 md:p-8 bg-white/50 dark:bg-gray-800/40 rounded-xl shadow-lg backdrop-blur-md border border-white/20 dark:border-gray-700/30 backdrop-filter h-full"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 text-4xl font-bold tracking-tight"
          >
            <span className="text-primary">Wido</span><span className="text-extra">File</span>
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4 text-3xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Quản lý dự án game chuyên nghiệp
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8 text-lg text-gray-600 dark:text-gray-300"
          >
            Nền tảng quản lý tài liệu và quy trình làm việc cho các đội ngũ phát triển game. Thiết kế đặc biệt cho quy
            trình làm việc trên nhiều vai trò khác nhau.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <h3 className="font-semibold text-primary dark:text-primary">Quản lý tài liệu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Lưu trữ, phiên bản, và duyệt tài liệu dự án</p>
            </div>
            <div className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <h3 className="font-semibold text-primary dark:text-primary">Phân vai trò</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Phân quyền chi tiết cho từng vai trò trong đội</p>
            </div>
            <div className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <h3 className="font-semibold text-primary dark:text-primary">Theo dõi tiến độ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Giám sát trạng thái và tiến độ dự án</p>
            </div>
            <div className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <h3 className="font-semibold text-primary dark:text-primary">Quy trình kiểm thử</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Quản lý test case và báo cáo lỗi</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Form đăng nhập bên phải */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          <Card className="flex flex-col w-full h-full shadow-lg bg-white/50 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 backdrop-filter">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                <span className="relative">
                  Đăng nhập
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 pt-3">
                Đăng nhập để quản lý dự án game của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <LoginForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}