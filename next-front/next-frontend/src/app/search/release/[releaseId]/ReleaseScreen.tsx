'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoPanel from '../../../components/release/InfoPanel';
import Stats from '../../../components/release/Stats';
import Tracks from '../../../components/release/Tracks';

interface Artist {
  name: string;
}

interface Format {
  name: string;
}

interface Track {
  position: string;
  title: string;
}

interface ReleaseData {
  title: string;
  artist: string;
  released: string;
  genres: string[];
  styles: string[];
  notes: string;
  tracklist: Track[];
  thumb: string;
  images: { uri: string }[];
  rating: number;
  numForSale: number;
  lowestPrice: number;
  formats: Format[];
  artists: Artist[];
}

const ReleaseContainer: React.FC<{ releaseId: number }> = ({ releaseId }) => {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);

  useEffect(() => {
    const fetchReleaseData = async () => {
      try {
        const response = await axios.get(`https://api.discogs.com/releases/${releaseId}`, {
          params: { token: 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl' },
        });
        const data = response.data;

        const releaseDetails: ReleaseData = {
          title: data.title || 'Unknown',
          artist: data.artists?.map((artist: Artist) => artist.name).join(', ') || 'Unknown Artist',
          released: data.released || 'Unknown Release Date',
          genres: data.genres || [],
          styles: data.styles || [],
          notes: data.notes || 'No notes available.',
          tracklist: data.tracklist || [],
          thumb: data.images[0]?.uri || '',
          images: data.images || [],
          rating: data.community?.rating?.average || 0,
          numForSale: data.num_for_sale || 0,
          lowestPrice: data.lowest_price || 0,
          formats: data.formats || [],
          artists: data.artists || [],
        };

        setReleaseData(releaseDetails);
      } catch (error) {
        console.error('Error fetching release details:', error);
      }
    };

    fetchReleaseData();
  }, [releaseId]);

  if (!releaseData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className="col-span-1 bg-white rounded-lg shadow-lg p-4">
          <InfoPanel releaseData={releaseData} />
        </div>

        {/* Stats Table */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-4">
            <Stats releaseData={releaseData} />
            <div className="col-span-2 bg-white rounded-lg shadow-lg p-4">
                <Tracks tracklist={releaseData.tracklist} />
            </div>
        </div>
       </div>
    </div>
  );
};

export default ReleaseContainer;