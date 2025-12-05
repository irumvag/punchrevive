import type { Metadata } from "next";
import { IBM_Plex_Mono, Creepster } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
          </div>

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Toast notifications with haunted theme */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000',
                color: '#0f0',
                border: '2px solid #0f0',
                fontFamily: 'IBM Plex Mono, monospace',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
              },
              success: {
                iconTheme: { primary: '#0f0', secondary: '#000' },
              },
              error: {
                style: {
                  background: '#000',
                  color: '#ff4444',
                  border: '2px solid #ff4444',
                  boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)',
                },
                iconTheme: { primary: '#ff4444', secondary: '#000' },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
