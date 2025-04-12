'use client';

import ForumPostForm from '@/components/ForumPage/ForumPostForm';

export default function EditForumPostPage({ params }: { params: { id: string } }) {
  return <ForumPostForm postId={params.id} isEdit={true} />;
} 