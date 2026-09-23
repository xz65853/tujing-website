import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import MobileBar from "@/components/site/MobileBar";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return {
    title: { default: s?.siteTitle || "途鲸传媒", template: `%s | ${s?.companyName || "途鲸传媒"}` },
    description: s?.siteDesc || s?.description || "",
    keywords: s?.siteKeywords || "",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
