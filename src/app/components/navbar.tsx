'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken(true); // force refresh
          localStorage.setItem('videoSummarize_token', token);
          setUser(firebaseUser);
          setShowExpiredDialog(false);
          sessionStorage.removeItem('session_expired_shown');
        } catch (err) {
          console.error('Token refresh failed:', err);
          handleSessionExpiry();
        }
      } else {
        handleSessionExpiry();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSessionExpiry = () => {
    localStorage.removeItem('videoSummarize_token');

    if (!sessionStorage.getItem('session_expired_shown')) {
      setShowExpiredDialog(true);
      sessionStorage.setItem('session_expired_shown', 'true');
    }

    setUser(null);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('videoSummarize_token', idToken);
      setUser(result.user);
      setShowExpiredDialog(false);
      sessionStorage.removeItem('session_expired_shown');
      router.push('/profile');
    } catch (err: any) {
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        console.warn('Login popup closed by user');
      } else {
        console.error('Login failed:', err);
        alert('Login failed! See console.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleSessionExpiry();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed! See console.');
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            VideoSummarize
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/upload" className="text-sm font-medium">
              Upload
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login with Google
              </button>
            )}
          </div>
        </nav>
      </header>

      {showExpiredDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Session Expired
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Your login session has expired. Please log in again.
            </p>
            <button
              onClick={() => setShowExpiredDialog(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
