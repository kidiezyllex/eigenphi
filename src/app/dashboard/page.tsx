'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@mdi/react';
import {
  mdiFileDocumentOutline,
  mdiForum,
  mdiCommentTextMultiple,
  mdiClipboardListOutline
} from '@mdi/js';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProfile } from '@/hooks/authentication';
import Image from 'next/image';

export default function DashboardPage() {
  const { profileData } = useProfile();
  const cards = [
    {
      title: 'Tài liệu của tôi',
      description: 'Quản lý tài liệu cá nhân và dự án',
      icon: mdiFileDocumentOutline,
      link: '/dashboard/documents',
      color: 'bg-[#2C8B3D]/10',
      iconColor: 'text-[#2C8B3D]',
      value: '15',
      unit: 'tài liệu'
    },
    {
      title: 'Diễn đàn dự án',
      description: 'Chia sẻ và thảo luận trong dự án',
      icon: mdiForum,
      link: '/dashboard/forum',
      color: 'bg-[#88C140]/10',
      iconColor: 'text-[#88C140]',
      value: '3',
      unit: 'dự án'
    },
    {
      title: 'Bình luận',
      description: 'Bình luận và phản hồi từ đồng nghiệp',
      icon: mdiCommentTextMultiple,
      link: '/dashboard/comments',
      color: 'bg-[#F2A024]/10',
      iconColor: 'text-[#F2A024]',
      value: '8',
      unit: 'bình luận mới'
    },
    {
      title: 'Nhiệm vụ thiết kế',
      description: 'Quản lý các nhiệm vụ thiết kế của bạn',
      icon: mdiClipboardListOutline,
      link: '/dashboard/tasks',
      color: 'bg-[#2C8B3D]/10',
      iconColor: 'text-[#2C8B3D]',
      value: '5',
      unit: 'nhiệm vụ'
    }
  ];

  // Animation variants for dashboard cards
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#2C8B3D] mb-2">
          <Image
            quality={100}
            draggable={false}
            alt="&quot;"
            src="/images/comma.png"
            width={100}
            height={100}
            className="w-4 sm:w-6 lg:w-7 inline mr-2"
            style={{ transform: "translateY(-6px)" }}
          />
          Chào mừng trở lại, <span className="text-active">{profileData?.data.fullName}!</span></h2>
        <p className="text-gray-600">Đây là tổng quan về hoạt động của bạn trong dự án thiết kế game.</p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {cards.map((card, index) => (
          <motion.div key={index} variants={item}>
            <Link href={card.link} className="flex flex-col h-full">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium text-maintext">{card.title}</CardTitle>
                  <div className={`p-2 rounded-full ${card.color}`}>
                    <Icon path={card.icon} size={1} className={card.iconColor} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 flex items-baseline gap-2">
                    <p className='text-primary font-bold text-3xl '>{card.value}</p>
                    <p className="text-sm text-gray-500">{card.unit}</p>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-[#2C8B3D]' : 'bg-[#F2A024]'}`}></div>
                  <div>
                    <p className="text-sm font-medium">
                      {i % 2 === 0 ? 'Đã tải lên tài liệu mới' : 'Đã bình luận về nhiệm vụ'}
                    </p>
                    <p className="text-xs text-gray-500">1 giờ trước</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch trình sắp tới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center justify-center min-w-10 bg-[#E9F3EB] rounded px-2 py-1">
                      <span className="text-xs font-medium text-[#2C8B3D]">T{i + 2}</span>
                      <span className="text-sm font-bold text-[#2C8B3D]">{10 + i}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hoàn thành thiết kế nhân vật</p>
                      <p className="text-xs text-gray-500">9:00 - 11:30</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-[#2C8B3D]/10">
                    <span className="text-xs text-[#2C8B3D]">Cao</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 