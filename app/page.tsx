'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HauntedLayout from '@/src/components/HauntedLayout';
import UploadZone from '@/src/components/UploadZone';
import VirtualPuncher from '@/src/components/VirtualPuncher';
import { uploadPunchCardImage, submitVirtualCard } from '@/src/utils/api-client';

type Mode = 'upload' | 'virtual';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle file upload from UploadZone
   */
  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const response = await uploadPunchCardImage(file, 'upload');
      
      if (response.success && response.jobId) {
        // Navigate to results page with job ID
        router.push(`/results/${response.jobId}`);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'The spirits are restless - upload failed');
      setIsProcessing(false);
    }
  };

  /**
   * Handle virtual card submission
   */
  const handleVirtualSubmit = async (pattern: boolean[][]) => {
    setIsProcessing(true);
    try {
      const response = await submitVirtualCard(pattern);
      
      if (response.success && response.jobId) {
        // Navigate to results page with job ID
        router.push(`/results/${response.jobId}`);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Virtual card submission error:', error);
      alert(error instanceof Error ? error.message : 'The spirits are restless - submission failed');
      setIsProcessing(false);
    }
  };

  return (
    <HauntedLayout>
      <main className="flex min-h-screen flex-col items-center justify-center py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-creepster mb-4 md:mb-6 text-toxic-green drop-shadow-[0_0_20px_rgba(0,255,0,0.7)] animate-pulse">
            PunchRevive
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 font-mono text-toxic-green">
            Resurrect Dead Code from the Crypt
          </p>
          <p className="text-xs sm:text-sm md:text-base opacity-70 font-mono max-w-2xl mx-auto">
            Upload vintage punch cards or create virtual ones to bring ancient code back to life
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md px-4">
          <button
            onClick={() => setMode('upload')}
            disabled={isProcessing}
            className={`
              w-full sm:w-auto px-6 py-3 font-mono text-sm md:text-base uppercase tracking-wider
              border-2 rounded-lg transition-all duration-300
              min-h-touch active:scale-95
              ${mode === 'upload'
                ? 'bg-toxic-green text-haunted-black border-toxic-green shadow-lg shadow-toxic-green/50'
                : 'bg-haunted-black text-toxic-green border-dark-green hover:border-toxic-green/70'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            📸 Upload Photo
          </button>
          <button
            onClick={() => setMode('virtual')}
            disabled={isProcessing}
            className={`
              w-full sm:w-auto px-6 py-3 font-mono text-sm md:text-base uppercase tracking-wider
              border-2 rounded-lg transition-all duration-300
              min-h-touch active:scale-95
              ${mode === 'virtual'
                ? 'bg-toxic-green text-haunted-black border-toxic-green shadow-lg shadow-toxic-green/50'
                : 'bg-haunted-black text-toxic-green border-dark-green hover:border-toxic-green/70'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ⌨️ Virtual Puncher
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-7xl px-4">
          {mode === 'upload' ? (
            <div className="animate-fadeIn">
              <UploadZone
                onUpload={handleUpload}
                acceptedFormats={['PNG', 'JPEG', 'WEBP']}
                maxSizeMB={10}
              />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <VirtualPuncher onSubmit={handleVirtualSubmit} />
            </div>
          )}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-haunted-black/90">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 border-4 border-toxic-green border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
              <p className="text-2xl font-creepster text-toxic-green animate-pulse">
                Summoning the spirits...
              </p>
              <p className="text-sm font-mono text-dark-green mt-2">
                Preparing resurrection ritual
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </HauntedLayout>
  );
}
