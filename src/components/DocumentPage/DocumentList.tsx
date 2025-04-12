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

interface DocumentListProps {
  type: 'personal' | 'project' | 'shared';
  projectId?: string;
}

export default function DocumentList({ type, projectId }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  
  const params: any = {};
  if (type === 'personal') {
    params.isPersonal = true;
  } else if (type === 'project' && projectId) {
    params.projectId = projectId;
  } else if (type === 'shared') {
    params.sharedWithMe = true;
  }
  
  const { data: documentsData, isLoading: isLoadingDocuments, error: documentsError } = useGetDocuments(params);
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetDocumentCategories();
  const deleteDocument = useDeleteDocument();

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

  // Xử lý xóa document
  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument.mutateAsync(docId);
      toast.success('Đã xóa tài liệu thành công!');
    } catch (error: any) {
      toast.error('Không thể xóa tài liệu', {
        description: error.message
      });
    }
  };

  const handleUpload = () => {
    toast.info('Chức năng tải lên tài liệu đang được phát triển');
  };

  if (isLoadingDocuments || isLoadingCategories) {
    return <div className="flex justify-center p-8">Đang tải dữ liệu...</div>;
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
      {/* Breadcrumb here */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">{titleMap[type]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2C8B3D]">{titleMap[type]}</h1>
        <Button 
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
          onClick={handleUpload}
        >
          <Icon path={mdiDownload} size={0.8} className="mr-2 rotate-180" />
          Tải lên tài liệu
        </Button>
      </div>

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
          <Icon path={mdiNoteRemove} size={3} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">Không có tài liệu nào</h3>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery 
              ? 'Không tìm thấy tài liệu nào phù hợp với từ khóa tìm kiếm.'
              : 'Hãy bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn.'}
          </p>
        </div>
      ) : (
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid">
                <Icon path="M8 24H24V8H8V24ZM0 16H6V10H0V16ZM0 24H6V18H0V24ZM0 8H6V2H0V8ZM8 8V2H24V8H8ZM10 10H22V22H10V10Z" size={0.7} />
              </TabsTrigger>
              <TabsTrigger value="list">
                <Icon path="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" size={0.7} />
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-2">
            <motion.div 
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredDocuments.map((document) => (
                <motion.div key={document._id} variants={item}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center mb-2">
                            <Icon 
                              path={getFileIcon(document.filePath || '')} 
                              size={1.2}
                              className="text-blue-500 mr-3 shrink-0" 
                            />
                            <div className="min-w-0">
                              <Link href={`/dashboard/documents/${document._id}`}>
                                <h3 className="font-medium truncate hover:text-[#2C8B3D]">
                                  {document.title}
                                </h3>
                              </Link>
                            </div>
                          </div>
                          
                          {document.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                              {document.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {document.category && (
                              <Badge variant="outline" className="text-xs">
                                {document.category.name}
                              </Badge>
                            )}
                            {document.tags?.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              {formatDate(document.createdAt)}
                            </p>
                            <div className="flex space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(document.filePath || '', document.title);
                                }}
                              >
                                <Icon path={mdiDownload} size={0.7} />
                              </Button>
                              
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(document._id);
                                }}
                              >
                                <Icon path={mdiShareVariant} size={0.7} />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Icon path={mdiDotsVertical} size={0.7} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/documents/edit/${document._id}`}>
                                      Chỉnh sửa
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDelete(document._id)}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-2">
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên tài liệu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Danh mục
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <tr key={document._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Icon 
                            path={getFileIcon(document.filePath || '')} 
                            size={1}
                            className="text-blue-500 mr-3" 
                          />
                          <div>
                            <Link href={`/dashboard/documents/${document._id}`}>
                              <div className="text-sm font-medium text-gray-900 hover:text-[#2C8B3D]">
                                {document.title}
                              </div>
                            </Link>
                            <div className="text-sm text-gray-500 line-clamp-1 md:hidden">
                              {document.category?.name || 'Không có danh mục'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        {document.category ? (
                          <Badge variant="outline">
                            {document.category.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(document.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(document.filePath || '', document.title);
                            }}
                          >
                            <Icon path={mdiDownload} size={0.7} />
                          </Button>
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(document._id);
                            }}
                          >
                            <Icon path={mdiShareVariant} size={0.7} />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Icon path={mdiDotsVertical} size={0.7} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/documents/edit/${document._id}`}>
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(document._id)}
                              >
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 