export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Browse is PUBLIC (no auth redirect).
  // Keep auth protection for other routes (e.g. /search, /clubs/[id]) in their own layouts.
  return <>{children}</>;
}
