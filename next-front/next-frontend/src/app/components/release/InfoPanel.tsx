import React from 'react';
import Image from 'next/image';

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
}

interface InfoPanelProps {
  releaseData: ReleaseData;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ releaseData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Album Image */}
      <div className="mb-4">
        <Image
          src={releaseData.thumb || releaseData.images[0]?.uri || '/placeholder-image.png'}
          alt={releaseData.title}
          className="w-full h-auto rounded-lg"
          width={75}
          height={75}
        />
      </div>

      <ul className="space-y-4">
        {/* Title */}
        <li className="text-center">
          <p className="text-sm font-light text-gray-500">Title</p>
          <p className="text-xl font-semibold">{releaseData.title}</p>
        </li>

        {/* Release Date */}
        <li className="text-center">
          <p className="text-sm font-light text-gray-500">Release Date</p>
          <p className="text-lg font-semibold">{releaseData.released}</p>
        </li>

        {/* Genre */}
        <li className="text-center">
          <p className="text-sm font-light text-gray-500">Genre</p>
          <p className="text-lg font-semibold">{releaseData.genres.join(', ')}</p>
        </li>

        {/* Styles */}
        <li className="text-center">
          <p className="text-sm font-light text-gray-500">Style(s)</p>
          <p className="text-lg font-semibold">{releaseData.styles.join(', ')}</p>
        </li>

        {/* Community Rating */}
        <li className="text-center">
          <p className="text-sm font-light text-gray-500">Community Rating</p>
          <p className="text-lg font-semibold">{releaseData.rating}</p>
        </li>
      </ul>
    </div>
  );
};

export default InfoPanel;