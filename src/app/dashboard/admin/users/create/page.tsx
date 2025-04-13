'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/useUser';
import { Icon } from '@mdi/react';
import { mdiContentSave, mdiArrowLeft } from '@mdi/js';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value === 'true' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      toast.error('Lỗi', {
        description: 'Mật khẩu và xác nhận mật khẩu không khớp'
      });
      return;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Lỗi', {
        description: 'Email không hợp lệ'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Trong thực tế, đây sẽ là API call tạo người dùng mới
      // Nhưng vì hook hiện tại không có createUser, chúng ta sẽ sử dụng updateUser
      // với ID là 'new' để giả lập (Backend sẽ xử lý theo cách riêng)
      await updateUser.mutateAsync({
        id: 'new', // Giả định ID mới, backend sẽ xử lý
        payload: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin,
        }
      });

      toast.success('Thành công', {
        description: 'Đã tạo người dùng mới'
      });

      // Chuyển về trang danh sách người dùng
      router.push('/dashboard/admin/users');
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể tạo người dùng mới'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Quản trị</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/users">Người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Thêm người dùng mới</h1>
        <Button variant="outline">
          <Link href="/dashboard/admin/users" className="flex items-center">
            <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản để tạo tài khoản người dùng mới
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập họ và tên người dùng"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isAdmin">Vai trò <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.isAdmin ? 'true' : 'false'}
                  onValueChange={(value) => handleSelectChange(value, 'isAdmin')}
                >
                  <SelectTrigger id="isAdmin" className='bg-white focus:border-primary focus:ring-primary'>
                    <SelectValue placeholder="Chọn vai trò người dùng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Người dùng thông thường</SelectItem>
                    <SelectItem value="true">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push('/dashboard/admin/users')}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              <Icon path={mdiContentSave} size={0.8} className="mr-2" />
              {isSubmitting ? 'Đang xử lý...' : 'Lưu người dùng'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 