import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "数智科技产业学院 - 济南幼儿师范高等专科学校",
  description:
    "济南幼儿师范高等专科学校数智科技产业学院，聚焦人工智能、大数据、数字商业与金融科技，以数智技术连接真实产业，培养面向数字经济未来的高技能人才。",
  keywords: [
    "数智科技产业学院",
    "济南幼儿师范高等专科学校",
    "人工智能技术应用",
    "大数据技术",
    "电子商务",
    "金融科技应用",
    "产教融合",
    "PBL",
    "生产型实训基地",
    "学生作品",
    "招生就业",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
