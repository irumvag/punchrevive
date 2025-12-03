'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import HauntedLayout from '@/src/components/HauntedLayout';
import ResurrectionAnimation from '@/src/components/ResurrectionAnimation';
import CodeDisplay from '@/src/components/CodeDisplay';
import ExorcismReport from '@/src/components/ExorcismReport';
import CertificateGenerator from '@/src/components/CertificateGenerator';
import ShareButton from '@/src/components/ShareButton';
import { waitForProcessing } from '@/src/utils/api-client';
import type { BugFix, LegacyLanguage, ModernLanguage } from '@/src/types/punch-card.types';

interface ResurrectionResult {
  punchCardImage: string;
  originalCode: string;
  originalLanguage: LegacyLanguage;
  translatedCode: string;
  targetLanguage: ModernLanguage;
  bugs: BugFix[];
  resultId: string;
  timestamp: Date;
}

export default function ResultsPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResurrectionResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Fetch processing status and wait for completion
  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided');
      setIsLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        // Wait for processing to complete
        const response = await waitForProcessing(jobId, (prog) => {
          setProgress(prog);
        });

        if (response.status === 'error') {
          throw new Error(response.error || 'Processing failed');
        }

        if (response.status === 'complete' && response.result) {
          setResult(response.result);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resurrection result');
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [jobId]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    setShowAnimation(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <HauntedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 border-4 border-toxic-green border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-3xl font-creepster text-toxic-green mb-4 animate-pulse">
              Performing Resurrection Ritual...
            </h2>
            <div className="w-full max-w-md mx-auto">
              <div className="bg-dark-green rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-toxic-green transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-mono text-dark-green mt-2">
                {progress}% complete
              </p>
            </div>
            <p className="text-sm font-mono text-dark-green mt-6">
              Summoning spirits... Decoding ancient patterns... Translating to modern tongue...
            </p>
          </div>
        </div>
      </HauntedLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <HauntedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="mb-6">
              <span className="text-6xl">💀</span>
            </div>
            <h2 className="text-3xl font-creepster text-red-500 mb-4">
              Resurrection Failed
            </h2>
            <p className="text-lg font-mono text-toxic-green mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 font-mono text-toxic-green border-2 border-toxic-green rounded-lg hover:bg-toxic-green hover:text-haunted-black transition-all duration-300"
            >
              ← Return to the Crypt
            </Link>
          </div>
        </div>
      </HauntedLayout>
    );
  }

  // No result state
  if (!result) {
    return (
      <HauntedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-mono text-toxic-green">
              No resurrection result found...
            </p>
          </div>
        </div>
      </HauntedLayout>
    );
  }

  // Show resurrection animation
  if (showAnimation && !animationComplete) {
    return (
      <ResurrectionAnimation
        punchCardImage={result.punchCardImage}
        translatedCode={result.translatedCode}
        onComplete={handleAnimationComplete}
      />
    );
  }

  // Show results
  return (
    <HauntedLayout>
      <main className="min-h-screen py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-creepster text-toxic-green mb-4 drop-shadow-[0_0_20px_rgba(0,255,0,0.7)]">
            ⚡ Resurrection Complete! ⚡
          </h1>
          <p className="text-lg md:text-xl font-mono text-dark-green">
            The ancient code has been brought back to life
          </p>
        </div>

        {/* Code Display */}
        <div className="mb-8">
          <CodeDisplay
            originalCode={result.originalCode}
            originalLanguage={result.originalLanguage}
            translatedCode={result.translatedCode}
            targetLanguage={result.targetLanguage}
            exorcismReport={result.bugs}
          />
        </div>

        {/* Exorcism Report */}
        <div className="mb-8">
          <ExorcismReport fixes={result.bugs} />
        </div>

        {/* Certificate Generator */}
        <div className="mb-8">
          <CertificateGenerator
            originalLanguage={result.originalLanguage}
            targetLanguage={result.targetLanguage}
            resurrectionDate={new Date(result.timestamp)}
            cardId={result.resultId}
          />
        </div>

        {/* Share Button */}
        <div className="mb-8">
          <ShareButton
            resultId={result.resultId}
            punchCardPreview={result.punchCardImage}
            codeSnippet={result.translatedCode.substring(0, 200)}
          />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-8 py-4 font-mono text-lg text-toxic-green border-2 border-toxic-green rounded-lg hover:bg-toxic-green hover:text-haunted-black transition-all duration-300 shadow-lg shadow-toxic-green/30"
          >
            ← Resurrect Another Card
          </Link>
        </div>
      </main>
    </HauntedLayout>
  );
}
