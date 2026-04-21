import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Matchpoint | Gestão de Ligas de Esportes de Raquete',
  description:
    'A plataforma definitiva para gerenciar ligas amadoras de Padel, Tênis, Beach Tennis e Pickleball. Crie sua liga, organize rodadas e acompanhe o ranking.',
  openGraph: {
    title: 'Matchpoint',
    description: 'A plataforma definitiva para gerenciar ligas amadoras de esportes de raquete.',
    url: 'https://matchpoint.app', // placeholder
    siteName: 'Matchpoint',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matchpoint',
    description: 'A plataforma definitiva para gerenciar ligas amadoras de esportes de raquete.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={cn(inter.variable, outfit.variable, 'font-sans')}>{children}</body>
    </html>
  );
}
