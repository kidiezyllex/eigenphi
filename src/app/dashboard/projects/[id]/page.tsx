'use client';

import { useState } from 'react';
import { useGetProjectById, useUpdateProject, useRemoveProjectMember, useAddProjectMember } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Icon } from '@mdi/react';
import { mdiPencil, mdiDelete, mdiPlus, mdiLoading, mdiAccountPlus } from '@mdi/js';
import { toast } from 'sonner';
import Link from 'next/link';
import { IProject } from '@/interface/response/project';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading, refetch } = useGetProjectById(params.id);
  const updateProject = useUpdateProject();
  const removeProjectMember = useRemoveProjectMember();
  const addProjectMember = useAddProjectMember();
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{id: string, name: string} | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberInfo, setNewMemberInfo] = useState({ userId: '', role: 'member' });
  const router = useRouter();

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await removeProjectMember.mutateAsync({
        projectId: params.id,
        userId: memberToRemove.id
      });
      toast.success('Thành công', {
        description: 'Đã xóa thành viên khỏi dự án thành công'
      });
      setIsRemoveMemberDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi xóa thành viên'
      });
    }
  };

  const handleAddMember = async () => {
    if (!newMemberInfo.userId) {
      toast.error('Lỗi', {
        description: 'Vui lòng nhập ID người dùng'
      });
      return;
    }
    
    try {
      await addProjectMember.mutateAsync({
        projectId: params.id,
        memberData: {
          userId: newMemberInfo.userId,
          role: newMemberInfo.role as 'lead' | 'member'
        }
      });
      toast.success('Thành công', {
        description: 'Đã thêm thành viên vào dự án thành công'
      });
      setIsAddMemberDialogOpen(false);
      setNewMemberInfo({ userId: '', role: 'member' });
      refetch();
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi thêm thành viên'
      });
    }
  };

  const openRemoveMemberDialog = (id: string, name: string) => {
    setMemberToRemove({ id, name });
    setIsRemoveMemberDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'ongoing':
      case 'đang diễn ra':
        return <Badge className="bg-green-500/80">Đang diễn ra</Badge>;
      case 'completed':
      case 'hoàn thành':
        return <Badge className="bg-blue-500/80">Hoàn thành</Badge>;
      case 'pending':
      case 'chờ xử lý':
        return <Badge className="bg-yellow-500/80">Chờ xử lý</Badge>;
      case 'cancelled':
      case 'đã hủy':
        return <Badge className="bg-red-500/80">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Invalid date';
    }
  };

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
              <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/projects/list">Danh sách dự án</BreadcrumbLink>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-muted-foreground">Không tìm thấy thông tin dự án</h2>
      </div>
    );
  }

  const project = data.data;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/projects/list">Danh sách dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
          {getStatusBadge(project.status)}
        </div>
        <Link href={`/dashboard/projects/edit/${params.id}`}>
          <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
            <Icon path={mdiPencil} size={0.8} className="mr-2" />
            Chỉnh sửa dự án
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="details">Thông tin dự án</TabsTrigger>
          <TabsTrigger value="members">Thành viên ({project.members.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết dự án</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mô tả</h3>
                    <p className="mt-1">
                      {project.description || 'Không có mô tả.'}
                    </p>
                  </div>
                  {(project.gameGenre || project.gamePlatform) && (
                    <div className="grid grid-cols-2 gap-4">
                      {project.gameGenre && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Thể loại game</h3>
                          <p className="mt-1">{project.gameGenre}</p>
                        </div>
                      )}
                      {project.gamePlatform && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Nền tảng game</h3>
                          <p className="mt-1">{project.gamePlatform}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Ngày tạo</h3>
                    <p className="mt-1">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</h3>
                    <p className="mt-1">{formatDate(project.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin dự án</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
                    <span>{getStatusBadge(project.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Ngày bắt đầu:</span>
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Ngày kết thúc:</span>
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Số thành viên:</span>
                    <span>{project.members.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Thành viên dự án</CardTitle>
              <Button 
                className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <Icon path={mdiAccountPlus} size={0.8} className="mr-2" />
                Thêm thành viên
              </Button>
            </CardHeader>
            <CardContent>
              {project.members.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Dự án chưa có thành viên nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.user._id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {member.user.avatar ? (
                            <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                          ) : null}
                          <AvatarFallback>{member.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role === 'lead' ? 'Trưởng nhóm' : 'Thành viên'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openRemoveMemberDialog(member.user._id, member.user.fullName)}
                        title="Xóa thành viên"
                      >
                        <Icon path={mdiDelete} size={0.8} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog xác nhận xóa thành viên */}
      <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa thành viên "{memberToRemove?.name}" khỏi dự án này? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsRemoveMemberDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleRemoveMember}
                  disabled={removeProjectMember.isPending}
                >
                  {removeProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xóa thành viên'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm thành viên */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Thêm thành viên vào dự án</DialogTitle>
                <DialogDescription>
                  Nhập thông tin người dùng để thêm vào dự án.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      ID Người dùng
                    </label>
                    <Input 
                      placeholder="Nhập ID người dùng" 
                      value={newMemberInfo.userId}
                      onChange={(e) => setNewMemberInfo({...newMemberInfo, userId: e.target.value})}
                      className='bg-white focus:border-primary focus:ring-primary'
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Vai trò
                    </label>
                    <Select
                      value={newMemberInfo.role}
                      onValueChange={(value) => setNewMemberInfo({...newMemberInfo, role: value})}
                    >
                      <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Thành viên</SelectItem>
                        <SelectItem value="lead">Trưởng nhóm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddMemberDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  onClick={handleAddMember}
                  disabled={addProjectMember.isPending}
                >
                  {addProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    'Thêm thành viên'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 