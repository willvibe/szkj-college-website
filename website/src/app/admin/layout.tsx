import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "后台管理 - 数智科技产业学院",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink">{children}</div>;
}
