import type { Metadata } from "next";
import { IBM_Plex_Mono, Creepster } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-ibm-plex-mono',
});

const creepster = Creepster({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-creepster',
});

export const metadata: Metadata = {
  title: "PunchRevive - Resurrect Dead Code",
  description: "Resurrect vintage punch card code into modern programming languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} ${creepster.variable} antialiased bg-haunted-black text-toxic-green font-mono`}
      >
        <div className="min-h-screen relative">
          {/* Haunted laboratory background */}
          <div className="fixed inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-dark-green to-haunted-black"></div>
            {/* Background decorative elements will be added in later tasks */}
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
