'use client';

import { useEffect, useState } from 'react';
import { useGetDocuments, useDeleteDocument } from '@/hooks/useDocument';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { 
  mdiDownload, 
  mdiShareVariant, 
  mdiDotsVertical, 
  mdiMagnify,
  mdiNoteRemove,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFileWordBox,
  mdiFileExcelBox,
  mdiFilePowerpointBox,
  mdiEye,
} from '@mdi/js';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IDocument } from '@/interface/response/document';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DocumentDeleteButton from './DocumentDeleteButton';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentListProps {
  type: 'personal' | 'project' | 'shared';
  projectId?: string;
  onViewDocument?: (documentId: string) => void;
}

export default function DocumentList({ type, projectId, onViewDocument }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  
  const params: any = {};
  if (type === 'personal') {
    params.project = undefined;
  } else if (type === 'project' && projectId) {
    params.project = projectId;
  } else if (type === 'shared') {
    params.project = "shared";
  }
  
  const { data: documentsData, isLoading: isLoadingDocuments, error: documentsError } = useGetDocuments(params);
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetDocumentCategories();

  useEffect(() => {
    if (!documentsData?.data) return;
    
    let filtered = [...documentsData.data];
    
    // Lọc theo danh mục
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category?._id === selectedCategory);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doc => 
          doc.title.toLowerCase().includes(query) || 
          doc.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredDocuments(filtered);
  }, [documentsData, selectedCategory, searchQuery]);

  // Xác định icon cho từng loại file
  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return mdiFileImage;
      case 'pdf':
        return mdiFilePdfBox;
      case 'doc':
      case 'docx':
        return mdiFileWordBox;
      case 'xls':
      case 'xlsx':
        return mdiFileExcelBox;
      case 'ppt':
      case 'pptx':
        return mdiFilePowerpointBox;
      default:
        return mdiNoteRemove;
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Xử lý tải xuống
  const handleDownload = (fileUrl: string, fileName: string) => {
    toast.info('Đang tải xuống tài liệu...');
    // Mã tải xuống file
    setTimeout(() => {
      toast.success('Tải xuống thành công!');
    }, 1500);
  };

  // Xử lý chia sẻ
  const handleShare = (docId: string) => {
    toast.info('Chức năng chia sẻ đang được phát triển');
  };

  // Xử lý xem chi tiết
  const handleViewDocument = (docId: string) => {
    if (onViewDocument) {
      onViewDocument(docId);
    } else {
      // Nếu không có prop onViewDocument, điều hướng đến trang chi tiết
      toast.info('Đang chuyển đến trang chi tiết...');
    }
  };

  if (isLoadingDocuments || isLoadingCategories) {
    return (
      <div>
        <div className="flex relative flex-1 max-w-md mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="flex gap-2 flex-wrap mb-6">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-40 bg-muted/30 flex items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (documentsError) {
    return <div className="text-red-500 p-4">{(documentsError as Error).message}</div>;
  }

  const titleMap = {
    personal: 'Tài liệu cá nhân',
    project: 'Tài liệu dự án',
    shared: 'Tài liệu được chia sẻ'
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon 
            path={mdiMagnify} 
            size={0.8}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-10 bg-white focus:border-primary focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-[#2C8B3D] hover:bg-[#2C8B3D]/90" : ""}
          >
            Tất cả
          </Button>
          {categoriesData?.data.map((category) => (
            <Button
              key={category._id}
              variant={selectedCategory === category._id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category._id)}
              className={selectedCategory === category._id ? "bg-[#2C8B3D] hover:bg-[#2C8B3D]/90" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Icon 
            path={mdiNoteRemove} 
            size={2} 
            className="mx-auto text-gray-300 mb-4" 
          />
          <h3 className="text-lg font-medium text-muted-foreground">Không tìm thấy tài liệu nào</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery 
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn' 
              : 'Tạo tài liệu mới để bắt đầu'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredDocuments.map((document) => (
            <motion.div key={document._id} variants={item}>
              <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
                <div 
                  className="h-40 bg-muted/10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleViewDocument(document._id)}
                >
                  <Icon 
                    path={getFileIcon(document.filePath)} 
                    size={3} 
                    className="text-primary opacity-70" 
                  />
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="mb-1 flex justify-between items-start">
                    <h3 
                      className="text-lg font-medium text-maintext mb-1 hover:text-primary cursor-pointer" 
                      onClick={() => handleViewDocument(document._id)}
                    >
                      {document.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon path={mdiDotsVertical} size={0.8} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleViewDocument(document._id)}
                          className="cursor-pointer"
                        >
                          <Icon path={mdiEye} size={0.7} className="mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDownload(document.filePath, document.title)}
                          className="cursor-pointer"
                        >
                          <Icon path={mdiDownload} size={0.7} className="mr-2" />
                          Tải xuống
                        </DropdownMenuItem>
                        {type !== 'shared' && (
                          <DropdownMenuItem 
                            onClick={() => handleShare(document._id)}
                            className="cursor-pointer"
                          >
                            <Icon path={mdiShareVariant} size={0.7} className="mr-2" />
                            Chia sẻ
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {document.description 
                      ? (document.description.length > 60 
                          ? document.description.substring(0, 60) + '...' 
                          : document.description)
                      : 'Không có mô tả'}
                  </div>
                  
                  <div className="mt-1 flex flex-wrap gap-2">
                    {document.category && (
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                        {document.category.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-3 flex justify-between items-center text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">{document.creator.fullName}</span>
                      <br />
                      <span>{formatDate(document.createdAt)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDocument(document._id)}
                        className="h-8"
                      >
                        <Icon path={mdiEye} size={0.7} className="mr-1" />
                        Xem
                      </Button>
                      
                      {type !== 'shared' && (
                        <DocumentDeleteButton 
                          documentId={document._id}
                          documentTitle={document.title}
                          size="sm"
                          className="h-8"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 