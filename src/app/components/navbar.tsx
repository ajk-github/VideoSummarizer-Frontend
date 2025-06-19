'use client';

import { usePathname } from 'next/navigation';
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
import { Button } from './ui/button';

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
          localStorage.setItem('edusummarize_token', token);
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
    localStorage.removeItem('edusummarize_token');

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
      localStorage.setItem('edusummarize_token', idToken);
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

  const pathname = usePathname();


  return (
  <>
  
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur">
      <nav className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            EduSummarize
          </span>
        </Link>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
  <ul className="font-medium flex flex-col md:flex-row items-center p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 md:border-0 rounded-lg bg-gray-50 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700 gap-4 md:gap-6">
  <li>
    <Link
      href="/"
      className={`block py-2 px-3 md:p-0 ${
        pathname === '/' ? 'text-blue-500' : 'text-white hover:text-blue-500'
      }`}
    >
      Home
    </Link>
  </li>
  <li>
    <Link
      href="/upload"
      className={`block py-2 px-3 md:p-0 ${
        pathname === '/upload' ? 'text-blue-500' : 'text-white hover:text-blue-500'
      }`}
    >
      Upload
    </Link>
  </li>
  {user ? (
    <>
      <li>
        <Link
          href="/profile"
          className={`block py-2 px-3 md:p-0 ${
            pathname === '/profile' ? 'text-blue-500' : 'text-white hover:text-blue-500'
          }`}
        >
          Profile
        </Link>
      </li>
      <li>
          {/* 👇 Don't modify logout button */}
          <button
                    onClick={handleLogout}
                    className="group flex items-center justify-start w-11 h-11 bg-red-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-md active:translate-x-1 active:translate-y-1"
                  >
                    <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                      <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                      </svg>
                    </div>
                    <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-sm font-medium transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      Logout
                    </div>
                  </button>
        </li>
      </>
    ) : (
      <li>
        <Button
          onClick={handleLogin}
          className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
        >
          <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 533.5 544.3"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="#4285f4"
                    d="M533.5 278.4c0-18.5-1.6-37-5.2-54.7H272v103.4h146.9c-6.3 33.9-25 62.5-53.3 81.7v67h86.1c50.6-46.6 79.8-115.1 79.8-197.4z"
                  />
                  <path
                    fill="#34a853"
                    d="M272 544.3c72.6 0 133.5-24 178-65.4l-86-67c-24 16-55 25.3-92 25.3-70.9 0-131-47.8-152.4-112.3h-89v70.4c44.7 88.2 136.2 149.9 241.4 149.9z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M119.6 324.9c-10.9-32.4-10.9-67.8 0-100.2v-70.4h-89c-38.7 76.9-38.7 168.3 0 245.2l89-74.6z"
                  />
                  <path
                    fill="#ea4335"
                    d="M272 107.7c38.8-.6 75.9 14.1 104.3 40.7l78.2-78.2C408.7 24 348 0 272 0 166.7 0 75.2 61.7 30.5 149.9l89 74.6c21.5-64.6 81.5-112.3 152.4-116.8z"
                  />
                </svg>
          {/* Google icon */}
          Login with Google
        </Button>
      </li>
    )}
  </ul>
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