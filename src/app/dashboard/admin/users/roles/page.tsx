'use client';

import { useState } from 'react';
import { useGetUsers, useUpdateUser } from '@/hooks/useUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiRefresh, 
  mdiShieldAccount,
  mdiAccountOutline,
  mdiContentSave
} from '@mdi/js';

export default function UserRolesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: usersData, isLoading } = useGetUsers();
  const updateUser = useUpdateUser();

  const filteredUsers = usersData?.data.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    setIsAdmin(user.role === 'admin');
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      
      await updateUser.mutateAsync({
        id: selectedUser._id,
        payload: {
          isAdmin: isAdmin
        }
      });

      toast.success('Thành công', {
        description: 'Đã cập nhật vai trò người dùng'
      });
      
      setIsRoleDialogOpen(false);
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật vai trò người dùng'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton loading
  if (isLoading) {
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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex mb-4 gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="border rounded-md">
              <div className="border-b h-12 flex items-center px-4">
                <Skeleton className="h-5 w-full" />
              </div>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b h-16 flex items-center px-4">
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbPage>Phân quyền</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Phân quyền người dùng</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Quản lý vai trò người dùng</CardTitle>
          <CardDescription>
            Phân quyền quản trị viên và người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 gap-2">
            <div className="relative flex-1">
              <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên, email, tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white focus:border-primary focus:ring-primary"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              <Icon path={mdiRefresh} size={0.8} className="mr-2" />
              Đặt lại
            </Button>
          </div>

          <div className="rounded-md border">
            <ScrollArea className="h-[calc(70vh-10rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">STT</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò hiện tại</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Icon path={mdiAccountOutline} size={2} className="text-gray-300 mb-2" />
                          <p className="text-lg font-medium text-gray-900">Không tìm thấy người dùng</p>
                          <p className="text-sm text-gray-500">
                            Không có người dùng nào phù hợp với tìm kiếm của bạn
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers?.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.fullName} />
                              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-maintext">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.username || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleOpenRoleDialog(user)}
                          >
                            <Icon path={mdiShieldAccount} size={0.7} className="mr-2" />
                            Đổi vai trò
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Dialog phân quyền */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Thay đổi vai trò người dùng</DialogTitle>
                <DialogDescription>
                  Thiết lập quyền quản trị cho người dùng trong hệ thống
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.fullName} />
                      <AvatarFallback className="text-xl">{selectedUser.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium">Quản trị viên</h4>
                            <p className="text-sm text-gray-500">
                              Cấp quyền quản trị cho người dùng này để họ có thể quản lý hệ thống
                            </p>
                          </div>
                          <Switch 
                            checked={isAdmin}
                            onCheckedChange={setIsAdmin}
                          />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-md font-medium mb-2">Mô tả vai trò:</h4>
                          <div className="pl-4 border-l-2 border-gray-200">
                            {isAdmin ? (
                              <div className="text-sm space-y-2 text-gray-600">
                                <p>• Quản lý tất cả người dùng trong hệ thống</p>
                                <p>• Quản lý và phê duyệt nội dung</p>
                                <p>• Quản lý cấu hình và cài đặt hệ thống</p>
                                <p>• Truy cập vào tất cả phần của hệ thống</p>
                                <p>• Xem báo cáo và thống kê</p>
                              </div>
                            ) : (
                              <div className="text-sm space-y-2 text-gray-600">
                                <p>• Truy cập vào các dự án được gán</p>
                                <p>• Tạo và quản lý tài liệu cá nhân</p>
                                <p>• Thực hiện các nhiệm vụ được giao</p>
                                <p>• Tương tác với các thành viên khác</p>
                                <p>• Không có quyền truy cập vào phần quản trị</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-2 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRoleDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSaveRole}
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon path={mdiContentSave} size={0.7} className="mr-2" />
                      {isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 