import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
export const metadata = {
  title: "Members Time | Private Golf Members Network",
  description: "A private network for verified golf club members to connect, arrange reciprocal rounds and enjoy friendly inter-club competition.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="min-h-screen bg-[#0b2a1f] text-white antialiased"><SiteHeader />{children}</body></html>;
}