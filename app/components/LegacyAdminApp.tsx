"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(
  () => import("../../admin-frontend/src/App.next"),
  { ssr: false }
);

export default function LegacyAdminApp() {
  return <AdminApp basename="/admin" />;
}
