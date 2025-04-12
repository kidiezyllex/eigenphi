'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Mặc định chuyển hướng đến trang tài liệu cá nhân
    router.push('/dashboard/documents/personal');
  }, [router]);
  
  return null;
} 