export default function SnippetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* メインエリア */}
      <div className="p-4 pb-10 md:mt-[88px] md:px-8 md:py-20 min-h-screen">
        {children}
      </div>
    </>
  );
}
