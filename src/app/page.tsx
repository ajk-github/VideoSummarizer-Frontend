'use client';
import { useEffect } from 'react';
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = 'hidden';

    return () => {
      // Re-enable scroll on unmount
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <main
      role="main"
      className="relative isolate px-6 pt-14 lg:px-8 bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300 h-screen overflow-hidden"
    >
      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 
                     bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 
                     sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 text-center">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          Turn Your Videos Into Smart Summaries
        </h1>
        <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-300 sm:text-xl">
          Transform your video learning experience with our AI-powered summarization and note-taking. Never miss important details again.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          
          

<Link
  href="/upload"
  className="group relative p-4 rounded-2xl backdrop-blur-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-black-900/60 to-black/80 shadow-2xl hover:shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer overflow-hidden"
>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-400/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

  <div className="relative z-10 flex items-center gap-4">
    <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/30 to-indigo-600/10 backdrop-blur-sm group-hover:from-indigo-400/40 group-hover:to-indigo-500/20 transition-all duration-300">
      {/* Optional icon */}
    </div>
    <div className="flex-1 text-left">
      <p className="text-indigo-400 font-bold text-lg group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-sm">
        Get Started
      </p>
      <p className="text-indigo-300/60 text-sm group-hover:text-indigo-200/80 transition-colors duration-300">
        Upload your video
      </p>
    </div>
    <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        className="w-5 h-5 text-indigo-400"
      >
        <path
          d="M9 5l7 7-7 7"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
</Link>


          
        </div>
      </div>

      {/* Bottom blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-20rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 
                     bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 
                     sm:left-[calc(50%+36rem)] sm:w-[72rem]"
        />
      </div>
    </main>
  );
}
