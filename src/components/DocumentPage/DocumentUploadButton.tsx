'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiUpload } from '@mdi/js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUploadDocument } from '@/hooks/useDocument';
import FileUpload from '@/components/Common/FileUpload';
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
  const [isOpen, setIsOpen] = useState(false);

  const handleUploadSuccess = (data: any) => {
    try {
      if (data?.success) {
        // Tạo document trong database với thông tin file đã upload
        const documentData = {
          title: data.data.document.title,
          description: data.data.document.description || '',
          category: data.data.document.category._id,
          project: projectId || undefined,
          filePath: data.data.document.filePath,
          fileType: data.data.document.fileType,
          fileSize: data.data.document.fileSize,
          isShared: data.data.document.isShared || type !== 'personal',
        };

        uploadDocument.mutate(documentData, {
          onSuccess: () => {
            toast.success("Thành công", {
              description: "Đã tải lên tài liệu thành công"
            });
            // Đóng dialog
            setIsOpen(false);
          },
          onError: (error: any) => {
            toast.error("Lỗi", {
              description: error.message || "Đã xảy ra lỗi khi lưu thông tin tài liệu"
            });
          }
        });
      } else {
        toast.error("Lỗi", {
          description: "Không thể tải lên tài liệu, vui lòng thử lại"
        });
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi tải tài liệu"
      });
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("Lỗi", {
      description: error.message || "Đã xảy ra lỗi khi tải tài liệu"
    });
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
              <DialogTitle className='text-maintext'>Tải lên tài liệu mới</DialogTitle>
            </DialogHeader>
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 