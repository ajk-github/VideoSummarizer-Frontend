import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9eWPDRdHI72kwA9tJ4Ok1MHCiElQYGh4",
  authDomain: "videosummarizer-b6392.firebaseapp.com",
  projectId: "videosummarizer-b6392"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export commonly used services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
