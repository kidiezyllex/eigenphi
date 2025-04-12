'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiUpload, mdiClose, mdiFileDocumentOutline } from '@mdi/js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadDocument } from '@/hooks/useDocument';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { useUpload } from '@/hooks/useUpload';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface DocumentUploadButtonProps {
  type: 'personal' | 'project' | 'shared';
  projectId?: string;
}

export default function DocumentUploadButton({ 
  type, 
  projectId 
}: DocumentUploadButtonProps) {
  const uploadDocument = useUploadDocument();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetDocumentCategories();
  const { uploadFile } = useUpload();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    isPersonal: type === 'personal',
    projectId: projectId || '',
    file: null as File | null,
  });
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: e.dataTransfer.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập tiêu đề tài liệu"
      });
      return;
    }

    if (!formData.file) {
      toast.error("Thiếu tập tin", {
        description: "Vui lòng chọn tập tin để tải lên"
      });
      return;
    }

    try {
      // 1. Upload file lên storage
      const uploadResponse = await uploadFile(formData.file);
      if (!uploadResponse || !uploadResponse.success) {
        throw new Error("Không thể tải tập tin lên hệ thống");
      }

      // 2. Create document in database
      const documentData = {
        title: formData.title,
        description: formData.description,
        category: formData.categoryId || undefined,
        project: formData.projectId || undefined,
        filePath: uploadResponse.data.document.filePath,
        fileType: formData.file.type,
        fileSize: formData.file.size,
        isShared: !formData.isPersonal,
      };

      const response = await uploadDocument.mutateAsync(documentData);
      if (!response || !response.success) {
        throw new Error("Không thể tạo tài liệu");
      }

      toast.success("Thành công", {
        description: "Đã tải lên tài liệu thành công"
      });

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        isPersonal: type === 'personal',
        projectId: projectId || '',
        file: null,
      });
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi tải tài liệu"
      });
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
          <Icon path={mdiUpload} size={0.8} className="mr-2" />
          Tải lên tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle>Tải lên tài liệu mới</DialogTitle>
              <DialogDescription>
                Điền thông tin và tải lên tài liệu của bạn vào hệ thống.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    className='bg-white focus:border-primary focus:ring-primary'
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề tài liệu"
                    required
                    disabled={uploadDocument.isPending}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    className='bg-white focus:border-primary focus:ring-primary'
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả tài liệu (tùy chọn)"
                    rows={3}
                    disabled={uploadDocument.isPending}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => handleSelectChange('categoryId', value)}
                    disabled={uploadDocument.isPending || isLoadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.data.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Tập tin</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      dragActive ? 'border-[#2C8B3D] bg-[#2C8B3D]/5' : 'border-gray-300'
                    } ${formData.file ? 'bg-[#E9F3EB]' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {!formData.file ? (
                      <div className="text-center">
                        <Icon 
                          path={mdiUpload} 
                          size={1.5} 
                          className="mx-auto text-gray-400 mb-2" 
                        />
                        <p className="text-sm font-medium mb-1">
                          Kéo và thả tập tin vào đây hoặc nhấp để chọn
                        </p>
                        <p className="text-xs text-gray-500">
                          Hỗ trợ các định dạng: DOC, DOCX, PDF, XLSX, PPTX, JPG, PNG
                        </p>
                        <Input
                          id="file"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={uploadDocument.isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => document.getElementById('file')?.click()}
                          disabled={uploadDocument.isPending}
                        >
                          Chọn tập tin
                        </Button>
                      </div>
                    ) : (
                      <motion.div 
                        className="flex items-center justify-between bg-white p-3 rounded-md"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center">
                          <Icon 
                            path={mdiFileDocumentOutline} 
                            size={1} 
                            className="text-[#2C8B3D] mr-3" 
                          />
                          <div>
                            <p className="font-medium text-gray-900">{formData.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          className="h-8 w-8"
                          disabled={uploadDocument.isPending}
                        >
                          <Icon path={mdiClose} size={0.7} className="text-gray-500" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={uploadDocument.isPending}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  disabled={uploadDocument.isPending}
                >
                  {uploadDocument.isPending ? 'Đang xử lý...' : 'Tải lên'}
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 