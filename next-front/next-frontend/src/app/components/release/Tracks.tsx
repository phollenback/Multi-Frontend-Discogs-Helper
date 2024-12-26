import React from 'react';

interface Track {
  position: string;
  title: string;
}

interface TracksProps {
  tracklist: Track[];
}

const Tracks: React.FC<TracksProps> = ({ tracklist }) => {
  if (!tracklist || tracklist.length === 0) {
    return <p className="text-center text-gray-500">No tracklist available.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tracklist</h3>
      <ul className="divide-y divide-gray-200">
        {tracklist.map((track, index) => (
          <li key={index} className="py-3 flex items-center">
            {/* Position */}
            <div className="w-1/6 text-gray-600 font-medium">{track.position}</div>
            {/* Track Title */}
            <div className="w-5/6 text-gray-800 font-semibold">{track.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tracks;