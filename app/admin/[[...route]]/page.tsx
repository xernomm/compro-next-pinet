"use client";

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled for client-side React Router SPA
const AdminApp = dynamic(() => import('@/admin-src/App'), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminApp />;
}
