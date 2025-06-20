'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { processVideo } from '@/lib/api';

export default function UploadPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLongProcessMessage, setShowLongProcessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  const getSafeDocId = async (videoUrl: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(videoUrl);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const startProcessing = async () => {
    if (!videoUrl) return;

    setIsProcessing(true);
    setError(null);
    setShowLongProcessMessage(false);

    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      const docId = await getSafeDocId(videoUrl);

      if (uid) {
        const docRef = doc(firestore, 'users', uid, 'history', docId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          router.push(`/profile/details?video_url=${encodeURIComponent(videoUrl)}`);
          return;
        }
      }

      processVideo(videoUrl).catch((err) => {
        console.error('Backend processing error (ignored):', err);
      });

      await new Promise(resolve => setTimeout(resolve, 20000));
      setShowLongProcessMessage(true);
      await new Promise(resolve => setTimeout(resolve, 10000));

      router.push('/profile');
    } catch (err: any) {
      console.error(err);
      setError('Failed to initiate processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(getAuth(), provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('edusummarize_token', idToken);
      router.push('/profile');
    } catch (err: any) {
      console.error('Login failed:', err);
      alert('Login failed. See console.');
    }
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 py-12 min-h-screen transition-colors duration-300 relative">
      {(isProcessing || showLongProcessMessage) && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 flex flex-col items-center justify-center z-50 text-center px-4">
          {!showLongProcessMessage ? (
            <>
              <div className="mb-4 text-gray-800 dark:text-white text-lg font-medium">
                Transcribing & Summarizing your video...
              </div>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            <div className="text-gray-800 dark:text-white text-lg font-medium max-w-md">
              Video is taking a long time to process.<br />
              Redirecting to user dashboard. The video will be available there.
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Video Transcription &amp; Summary
        </h1>

        {!user ? (
          <div className="text-center p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <p className="mb-4">This feature is only available after logging in.</p>
            
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
              Login with Google
            </button>


          </div>
        ) : (
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">Paste Video URL</h2>
            <div className="flex">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-grow px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none rounded-l-md"
              />
              <button
                onClick={startProcessing}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 font-medium rounded-r-md"
                disabled={isProcessing || showLongProcessMessage}
              >
                {isProcessing || showLongProcessMessage ? 'Processing...' : 'Transcribe & Summarize'}
              </button>
            </div>
          </section>
        )}

        {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
      </div>
    </main>
  );
}
