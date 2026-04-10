import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import '../../admin-frontend/src/index.css';
import '../../admin-frontend/src/App.css';
import '../../admin-frontend/src/styles/AdminTheme.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Compro Admin',
  description: 'Admin dashboard for Compro Next',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
