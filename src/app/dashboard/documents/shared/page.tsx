'use client';

import { useState } from 'react';
import { useGetDocuments } from '@/hooks/useDocument';
import DocumentList from '@/components/DocumentPage/DocumentList';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentDetail from '@/components/DocumentPage/DocumentDetail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function SharedDocumentsPage() {
  const { data, isLoading, error } = useGetDocuments({ project: "shared" });
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

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
              <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-40 w-full rounded-t-lg" />
              <div className="space-y-2 px-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-2/4" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md border border-red-200">
        {error.message || 'Đã xảy ra lỗi khi tải dữ liệu.'}
      </div>
    );
  }

  if (selectedDocumentId) {
    return (
      <DocumentDetail 
        id={selectedDocumentId} 
        onBack={() => setSelectedDocumentId(null)}
      />
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
            <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Tài liệu được chia sẻ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Tài liệu được chia sẻ với tôi</h1>
      </div>

      <DocumentList 
        type="shared" 
        onViewDocument={(documentId: string) => setSelectedDocumentId(documentId)}
      />
    </div>
  );
} 