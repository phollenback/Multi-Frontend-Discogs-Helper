import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Release } from './SearchScreen'; // Import the Release type
import Image from 'next/image';

interface SearchListProps {
  releases: Release[];
}

const SearchList: React.FC<SearchListProps> = ({ releases }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((release) => (
        <div
          key={release.id}
          className="max-w-sm rounded-lg shadow-lg bg-white p-4 cursor-pointer hover:bg-gray-100"
        >
          <Link href={`/search/release/${release.id}`}>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24">
                <Image
                  src={release.thumb}
                  alt={release.title}
                  height={150}
                  width={150}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{release.title}</h3>
                <p className="text-sm text-gray-500">{release.year}</p>
                <p className="text-sm text-gray-500">{release.genre.join(', ')}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchList;