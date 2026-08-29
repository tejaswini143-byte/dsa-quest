'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProblemById } from '@/lib/problems/registry';
import { UniversalProblemEngine } from '@/components/engine/UniversalProblemEngine';

export default function DynamicProblemPage() {
  const params = useParams();
  const problemId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const problem = getProblemById(problemId);

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-2xl font-black text-white font-mono mb-2">
          Quest Problem Not Found
        </h1>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          The requested problem "{problemId}" is not registered in the DSA Quest problem registry.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs"
        >
          ← Return to World Map
        </Link>
      </div>
    );
  }

  return <UniversalProblemEngine problem={problem} />;
}
