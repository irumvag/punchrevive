'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import HauntedLayout from '@/src/components/HauntedLayout';
import CodeDisplay from '@/src/components/CodeDisplay';
import ExorcismReport from '@/src/components/ExorcismReport';
import type { BugFix, LegacyLanguage, ModernLanguage } from '@/src/types/punch-card.types';

interface SharedResult {
  punchCardImage: string;
  originalCode: string;
  originalLanguage: LegacyLanguage;
  translatedCode: string;
  targetLanguage: ModernLanguage;
  bugs: BugFix[];
  resultId: string;
  timestamp: Date;
  views: number;
}

export default function SharedResultPage() {
  const params = useParams();
  const shareId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SharedResult | null>(null);

  // Fetch shared result
  useEffect(() => {
    if (!shareId) {
      setError('No share ID provided');
      setIsLoading(false);
      return;
    }

    const fetchSharedResult = async () => {
      try {
        const response = await fetch(`/api/share/${shareId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('This resurrection has faded into the void (expired or invalid ID)');
          }
          throw new Error('Failed to load shared result');
        }

        const data = await response.json();
        setResult(data.result);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch shared result:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shared result');
        setIsLoading(false);
      }
    };

    fetchSharedResult();
  }, [shareId]);

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
              Summoning Shared Resurrection...
            </h2>
            <p className="text-sm font-mono text-dark-green mt-4">
              Retrieving from the digital crypt...
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
              <span className="text-6xl">👻</span>
            </div>
            <h2 className="text-3xl font-creepster text-red-500 mb-4">
              Resurrection Not Found
            </h2>
            <p className="text-lg font-mono text-toxic-green mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 font-mono text-toxic-green border-2 border-toxic-green rounded-lg hover:bg-toxic-green hover:text-haunted-black transition-all duration-300"
            >
              ← Create Your Own Resurrection
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
              No shared result found...
            </p>
          </div>
        </div>
      </HauntedLayout>
    );
  }

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show shared result
  return (
    <HauntedLayout>
      <main className="min-h-screen py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-creepster text-toxic-green mb-4 drop-shadow-[0_0_20px_rgba(0,255,0,0.7)]">
            👻 Shared Code Resurrection 👻
          </h1>
          <p className="text-base md:text-lg font-mono text-dark-green mb-2">
            Resurrected on {formatDate(result.timestamp)}
          </p>
          <p className="text-sm font-mono text-dark-green">
            {result.views} spirit{result.views !== 1 ? 's' : ''} have witnessed this resurrection
          </p>
        </div>

        {/* Punch Card Display */}
        <div className="mb-8 max-w-4xl mx-auto px-4">
          <div className="bg-haunted-black border-2 border-toxic-green rounded-lg p-6 shadow-lg shadow-toxic-green/30">
            <h2 className="text-2xl font-creepster text-toxic-green mb-4 text-center">
              Original Punch Card
            </h2>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.punchCardImage}
                alt="Original punch card"
                className="max-w-full h-auto border border-dark-green rounded"
              />
            </div>
          </div>
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

        {/* Call to Action */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-lg font-mono text-toxic-green mb-6">
            Want to resurrect your own dead code?
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 font-mono text-lg text-toxic-green border-2 border-toxic-green rounded-lg hover:bg-toxic-green hover:text-haunted-black transition-all duration-300 shadow-lg shadow-toxic-green/30"
          >
            ⚡ Start Your Own Resurrection ⚡
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 px-4">
          <div className="max-w-2xl mx-auto bg-dark-green/20 border border-dark-green rounded-lg p-6">
            <h3 className="text-xl font-creepster text-toxic-green mb-3">
              About PunchRevive
            </h3>
            <p className="text-sm font-mono text-dark-green leading-relaxed">
              PunchRevive brings vintage punch card code back to life using computer vision,
              AI translation, and automatic bug fixing. Upload photos of IBM punch cards or
              create virtual ones to resurrect ancient FORTRAN, COBOL, Assembler, and BASIC
              code into modern Python or JavaScript.
            </p>
          </div>
        </div>
      </main>
    </HauntedLayout>
  );
}
