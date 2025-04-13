'use client';

import { useState } from 'react';
import { useGetUsers, useDeleteUser } from '@/hooks/useUser';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { 
  mdiPlus, 
  mdiMagnify, 
  mdiPencilOutline, 
  mdiTrashCanOutline, 
  mdiEye,
  mdiRefresh,
  mdiAccountOutline
} from '@mdi/js';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);

  const { data: usersData, isLoading } = useGetUsers();
  const deleteUser = useDeleteUser();

  const filteredUsers = usersData?.data.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser.mutateAsync(selectedUserId);
      toast.success('Thành công', {
        description: 'Xóa người dùng thành công'
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể xóa người dùng'
      });
    }
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const openUserDetails = (user: any) => {
    setSelectedUserDetails(user);
    setIsUserDetailsOpen(true);
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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
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
            <BreadcrumbPage>Người dùng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Quản lý người dùng</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/admin/users/create" className="flex items-center">
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Thêm người dùng mới
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý tất cả người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 gap-2">
            <div className="relative flex-1">
              <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên, email, chức vụ..."
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
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
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
                        <TableCell>{user.position || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                              onClick={() => openUserDetails(user)}
                            >
                              <Icon path={mdiEye} size={0.7} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500"
                              asChild
                            >
                              <Link href={`/dashboard/admin/users/edit/${user._id}`}>
                                <Icon path={mdiPencilOutline} size={0.7} />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => openDeleteDialog(user._id)}
                            >
                              <Icon path={mdiTrashCanOutline} size={0.7} />
                            </Button>
                          </div>
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

      {/* Chi tiết người dùng */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-2">
                <DialogTitle>Thông tin người dùng</DialogTitle>
                <DialogDescription>
                  Chi tiết thông tin người dùng trong hệ thống
                </DialogDescription>
              </DialogHeader>

              {selectedUserDetails && (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-3 md:w-1/3">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={selectedUserDetails.avatar} alt={selectedUserDetails.fullName} />
                        <AvatarFallback className="text-2xl">{selectedUserDetails.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold text-center">{selectedUserDetails.fullName}</h3>
                      <Badge variant={selectedUserDetails.role === 'admin' ? 'destructive' : 'secondary'}>
                        {selectedUserDetails.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      </Badge>
                      {selectedUserDetails.position && (
                        <p className="text-gray-500 text-sm text-center">{selectedUserDetails.position}</p>
                      )}
                    </div>

                    <div className="md:w-2/3 space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Tên đăng nhập</p>
                              <p>{selectedUserDetails.username || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p>{selectedUserDetails.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                              <p>{selectedUserDetails.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                              <p>{selectedUserDetails.address || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phòng ban</p>
                              <p>{selectedUserDetails.department || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Mã nhân viên</p>
                              <p>{selectedUserDetails.employeeId || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-500">Kỹ năng</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedUserDetails.skills?.length > 0 
                                  ? selectedUserDetails.skills.map((skill: string, index: number) => (
                                      <Badge key={index} variant="outline">{skill}</Badge>
                                    ))
                                  : 'Chưa cập nhật'
                                }
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-500">Giới thiệu</p>
                              <p className="mt-1">{selectedUserDetails.bio || 'Chưa cập nhật'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsUserDetailsOpen(false)}
                        >
                          Đóng
                        </Button>
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-600"
                          asChild
                        >
                          <Link href={`/dashboard/admin/users/edit/${selectedUserDetails._id}`}>
                            <Icon path={mdiPencilOutline} size={0.7} className="mr-2" />
                            Chỉnh sửa
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 