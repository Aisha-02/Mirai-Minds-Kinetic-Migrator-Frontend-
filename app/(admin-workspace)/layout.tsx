"use client";

import { AdminWorkspaceProvider } from "@/context/AdminWorkspaceContext";

export default function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminWorkspaceProvider>{children}</AdminWorkspaceProvider>;
}
