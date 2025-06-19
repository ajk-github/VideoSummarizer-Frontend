import { Suspense } from 'react';
import DetailsPage from './DetailsClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-700">Loading...</div>}>
      <DetailsPage />
    </Suspense>
  );
}
