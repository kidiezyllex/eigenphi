'use client';

import { useState } from 'react';
import { useDeleteDocument } from '@/hooks/useDocument';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import { toast } from 'sonner';
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

interface DocumentDeleteButtonProps {
  documentId: string;
  documentTitle: string;
  onSuccess?: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function DocumentDeleteButton({
  documentId,
  documentTitle,
  onSuccess,
  variant = 'outline',
  size = 'sm',
  className = '',
}: DocumentDeleteButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteDocument = useDeleteDocument();

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync(documentId);
      toast.success('Xóa tài liệu thành công');
      setIsConfirmOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error('Xóa tài liệu thất bại', {
        description: error.message || 'Đã có lỗi xảy ra khi xóa tài liệu',
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsConfirmOpen(true)}
        className={`text-red-medium hover:text-red-medium/90 ${className}`}
      >
        <Icon path={mdiDeleteOutline} size={0.8} className="mr-1" />
        Xóa
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "<span className="font-medium">{documentTitle}</span>"? 
              Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-medium hover:bg-red-medium/90"
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? 'Đang xử lý...' : 'Xóa tài liệu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 