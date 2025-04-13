'use client';

import { useState } from 'react';
import { useGetProjects, useAddProjectMember, useRemoveProjectMember } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogHeader,
  DialogTitle,
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
import { mdiDelete, mdiLoading, mdiAccountPlus } from '@mdi/js';
import { toast } from 'sonner';
import { IProject } from '@/interface/response/project';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function MembersManagementPage() {
  const { data, isLoading, refetch } = useGetProjects();
  const removeProjectMember = useRemoveProjectMember();
  const addProjectMember = useAddProjectMember();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{id: string, name: string, projectId: string} | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberInfo, setNewMemberInfo] = useState({ userId: '', role: 'member' });

  const selectedProject = data?.data.find(project => project._id === selectedProjectId);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await removeProjectMember.mutateAsync({
        projectId: memberToRemove.projectId,
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
    if (!selectedProjectId) {
      toast.error('Lỗi', {
        description: 'Vui lòng chọn dự án'
      });
      return;
    }

    if (!newMemberInfo.userId) {
      toast.error('Lỗi', {
        description: 'Vui lòng nhập ID người dùng'
      });
      return;
    }
    
    try {
      await addProjectMember.mutateAsync({
        projectId: selectedProjectId,
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

  const openRemoveMemberDialog = (projectId: string, userId: string, name: string) => {
    setMemberToRemove({ id: userId, name, projectId });
    setIsRemoveMemberDialogOpen(true);
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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <Skeleton className="h-10 w-full max-w-xs" />
        
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
            <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Quản lý thành viên</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Quản lý thành viên dự án</h1>
        <Button 
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
          onClick={() => setIsAddMemberDialogOpen(true)}
          disabled={!selectedProjectId}
        >
          <Icon path={mdiAccountPlus} size={0.8} className="mr-2" />
          Thêm thành viên
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select 
          value={selectedProjectId} 
          onValueChange={setSelectedProjectId}
        >
          <SelectTrigger className="w-full max-w-md bg-white focus:border-primary focus:ring-primary">
            <SelectValue placeholder="Chọn dự án" />
          </SelectTrigger>
          <SelectContent>
            {data?.data.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedProjectId ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">Vui lòng chọn dự án</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn một dự án từ danh sách để xem và quản lý thành viên
          </p>
        </div>
      ) : (
        <Tabs defaultValue="list">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Danh sách thành viên</TabsTrigger>
            <TabsTrigger value="roles">Vai trò thành viên</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thành viên dự án: {selectedProject?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProject?.members.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Dự án chưa có thành viên nào.</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thành viên</TableHead>
                          <TableHead>Vai trò</TableHead>
                          <TableHead>Ngày tham gia</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject?.members.map((member) => (
                          <TableRow key={member.user._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  {member.user.avatar ? (
                                    <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                                  ) : null}
                                  <AvatarFallback>{member.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.user.fullName}</p>
                                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={member.role === 'lead' ? 'bg-blue-500' : 'bg-gray-500'}>
                                {member.role === 'lead' ? 'Trưởng nhóm' : 'Thành viên'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {member.joinDate ? format(new Date(member.joinDate), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => openRemoveMemberDialog(selectedProjectId, member.user._id, member.user.fullName)}
                                title="Xóa thành viên"
                              >
                                <Icon path={mdiDelete} size={0.8} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vai trò thành viên trong dự án: {selectedProject?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg">Trưởng nhóm</h3>
                    <p className="text-muted-foreground mt-1 mb-3">
                      Trưởng nhóm có quyền quản lý dự án, thêm/xóa thành viên, và cập nhật thông tin dự án
                    </p>
                    {selectedProject?.members.filter(m => m.role === 'lead').length === 0 ? (
                      <p className="text-sm text-muted-foreground">Không có trưởng nhóm</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject?.members.filter(m => m.role === 'lead').map(member => (
                          <div key={member.user._id} className="flex items-center gap-3 p-2 border rounded-md">
                            <Avatar>
                              {member.user.avatar ? (
                                <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                              ) : null}
                              <AvatarFallback>{member.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg">Thành viên</h3>
                    <p className="text-muted-foreground mt-1 mb-3">
                      Thành viên có quyền xem thông tin dự án và tham gia vào các hoạt động của dự án
                    </p>
                    {selectedProject?.members.filter(m => m.role === 'member').length === 0 ? (
                      <p className="text-sm text-muted-foreground">Không có thành viên</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject?.members.filter(m => m.role === 'member').map(member => (
                          <div key={member.user._id} className="flex items-center gap-3 p-2 border rounded-md">
                            <Avatar>
                              {member.user.avatar ? (
                                <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                              ) : null}
                              <AvatarFallback>{member.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

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
                    <Label>ID Người dùng</Label>
                    <Input 
                      placeholder="Nhập ID người dùng" 
                      value={newMemberInfo.userId}
                      onChange={(e) => setNewMemberInfo({...newMemberInfo, userId: e.target.value})}
                      className='bg-white focus:border-primary focus:ring-primary'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vai trò</Label>
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