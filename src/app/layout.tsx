import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Members Time",
  description: "Hosted golf experiences with verified members.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b2a1f] text-white antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
