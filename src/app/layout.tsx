import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moon Calendar API',
  description: 'Accurate lunar calendar and moon phase API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
