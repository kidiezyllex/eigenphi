import type { Metadata } from 'next';
import './globals.css';
import './font.css';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/provider/ToastProvider';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';
import { UserProvider } from '@/context/useUserContext';
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Open_Sans } from 'next/font/google';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CustomScrollArea } from '@/components/ui/custom-scroll-area';

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-opensans',
});

export const metadata: Metadata = {
  title: 'eigenphi',
  icons: {
    icon: '/images/faviconV2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="vi" suppressHydrationWarning className={openSans.className}>
      <body className="bg-mainDarkBackgroundV1 min-h-screen">
        <ReactQueryClientProvider>
          <UserProvider>
            <NextTopLoader
              color="#44D7B6"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              showSpinner={false}
            />
            <ToastProvider />
            <DashboardLayout>
              <CustomScrollArea className="h-full">
                {children}
              </CustomScrollArea>
            </DashboardLayout>;
          </UserProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
