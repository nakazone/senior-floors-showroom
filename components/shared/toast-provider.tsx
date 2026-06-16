"use client";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export { toast } from "sonner";
