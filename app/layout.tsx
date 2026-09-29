import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIAKAD AI — SMA Pemberdayaan Bangsa',
  description: 'Academic information system with AI-powered assessment and secure exam engine.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
