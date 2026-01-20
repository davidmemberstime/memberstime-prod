import "./globals.css";

export const metadata = {
  title: "Members Time",
  description: "Hosted golf experiences with verified members."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b2a1f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}

