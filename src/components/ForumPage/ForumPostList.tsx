'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetForumPosts } from '@/hooks/useForumPost';
import { useRouter } from 'next/navigation';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiComment, 
  mdiEye, 
  mdiPencil, 
  mdiDotsVertical,
  mdiPlus 
} from '@mdi/js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ForumPostListProps {
  projectId?: string;
  isMyPosts?: boolean;
}

export default function ForumPostList({ projectId, isMyPosts = false }: ForumPostListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  
  const params: any = {};
  if (projectId) {
    params.projectId = projectId;
  }
  if (isMyPosts) {
    params.myPosts = true;
  }
  
  const { data, isLoading, error } = useGetForumPosts(params);

  useEffect(() => {
    if (!data?.data) return;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(
        data.data.filter(
          post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPosts(data.data);
    }
  }, [data, searchQuery]);

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };
  
  // Rút gọn nội dung
  const truncateContent = (content: string, length = 120) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + '...';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{(error as Error).message}</div>;
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2C8B3D]">
          {isMyPosts ? 'Bài viết của tôi' : 'Diễn đàn dự án'}
        </h1>
        <Button 
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
          onClick={() => router.push('/dashboard/forum/create')}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Tạo bài viết mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Icon 
            path={mdiMagnify} 
            size={0.8}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <Icon path={mdiComment} size={3} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">Không có bài viết nào</h3>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery 
              ? 'Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.'
              : isMyPosts 
                ? 'Bạn chưa tạo bài viết nào.'
                : 'Hãy bắt đầu cuộc thảo luận bằng cách tạo bài viết đầu tiên.' }
          </p>
          {!isMyPosts && (
            <Button 
              className="mt-4 bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
              onClick={() => router.push('/dashboard/forum/create')}
            >
              <Icon path={mdiPlus} size={0.8} className="mr-2" />
              Tạo bài viết mới
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post._id} variants={item}>
              <Link href={`/dashboard/forum/posts/${post._id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Badge 
                        variant="outline" 
                        className="mb-2 bg-[#E9F3EB] text-[#2C8B3D] border-[#2C8B3D]/20"
                      >
                        {post.project?.name || 'Chung'}
                      </Badge>
                      {post.isAuthor && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icon path={mdiDotsVertical} size={0.7} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.preventDefault();
                              router.push(`/dashboard/forum/edit/${post._id}`);
                            }}>
                              <Icon path={mdiPencil} size={0.7} className="mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">
                      {truncateContent(post.content)}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-3 border-t flex flex-col items-start">
                    <div className="flex items-center w-full justify-between mb-3">
                      <div className="flex items-center text-gray-500 text-sm gap-4">
                        <div className="flex items-center">
                          <Icon path={mdiEye} size={0.7} className="mr-1.5" />
                          <span>{post.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Icon path={mdiComment} size={0.7} className="mr-1.5" />
                          <span>{post.commentCount || 0}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarImage src={post.author?.avatar || ''} />
                        <AvatarFallback>
                          {post.author?.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">
                        {post.author?.fullName || 'Người dùng'}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}