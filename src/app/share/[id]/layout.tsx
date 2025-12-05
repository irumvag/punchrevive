import type { Metadata } from 'next';

// Generate metadata for Open Graph tags
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: shareId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/share/${shareId}`;

  return {
    title: 'I just resurrected dead code #PunchRevive',
    description: 'Check out this vintage punch card code brought back to life with PunchRevive - resurrecting ancient FORTRAN, COBOL, and BASIC into modern Python and JavaScript.',
    openGraph: {
      title: 'I just resurrected dead code #PunchRevive',
      description: 'Vintage punch card code brought back to life with AI translation and automatic bug fixing.',
      url: shareUrl,
      siteName: 'PunchRevive',
      images: [
        {
          url: `${baseUrl}/api/og-image/${shareId}`,
          width: 1200,
          height: 630,
          alt: 'PunchRevive - Resurrected Code',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'I just resurrected dead code #PunchRevive',
      description: 'Vintage punch card code brought back to life with AI translation and automatic bug fixing.',
      images: [`${baseUrl}/api/og-image/${shareId}`],
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
