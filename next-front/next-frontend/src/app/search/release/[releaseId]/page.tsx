// src/app/search/release/[releaseId]/page.tsx

'use client';

import React from 'react';
import { useParams } from 'next/navigation'; // Import useParams from next/navigation
import ReleaseScreen from './ReleaseScreen'; // Import the ReleaseContainer

const OneReleasePage = () => {
  const params = useParams(); // Get route params
  const { releaseId } = params;  // Extract the releaseId from the params

  if (!releaseId) {
    return <p>Release ID not found in URL</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <ReleaseScreen releaseId={Number(releaseId)} /> {/* Pass releaseId to the container */}
    </div>
  );
};

export default OneReleasePage;