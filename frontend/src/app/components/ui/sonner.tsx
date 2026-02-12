"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#333333] group-[.toaster]:border-[#E0E0E0] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[#666666]',
          actionButton: 'group-[.toast]:bg-[#0047AB] group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-[#F5F5F5] group-[.toast]:text-[#666666]',
          closeButton: 'group-[.toast]:bg-white group-[.toast]:border-[#E0E0E0] group-[.toast]:text-[#666666] hover:group-[.toast]:bg-[#F5F5F5]',
          // CALL:ACT 색상 시스템 통합
          success: 'group-[.toast]:bg-[#F0F9FF] group-[.toast]:text-[#0047AB] group-[.toast]:border-[#0047AB]/20',
          error: 'group-[.toast]:bg-[#FEF2F2] group-[.toast]:text-[#DC2626] group-[.toast]:border-[#DC2626]/20',
          warning: 'group-[.toast]:bg-[#FFFBEB] group-[.toast]:text-[#D97706] group-[.toast]:border-[#FBBC04]/30',
          info: 'group-[.toast]:bg-[#F0F9FF] group-[.toast]:text-[#0047AB] group-[.toast]:border-[#0047AB]/20',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
