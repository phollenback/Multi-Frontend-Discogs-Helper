// src/app/search/SearchScreen.tsx

'use client';

import React, { useState, useEffect } from 'react';
import SearchForm from '../search/SearchForm';
import SearchList from './SearchList';
import axios from 'axios';

// Define the type for the release item
export interface Release {
  thumb: string;
  year: string;
  genre: string[];
  style: string[];
  id: number;
  title: string;
}

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    if (searchTerm !== '') {
      loadResults(searchTerm);  // Pass searchTerm here
    }
  }, [searchTerm]);

  const loadResults = async (term: string) => {
    try {
      const response = await axios.get('https://api.discogs.com/database/search', {
        params: {
          q: term,
          token: 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl',
          type: 'release',
        },
      });

      const releasesData: Release[] = response.data.results.map((item: Release) => ({
        thumb: item.thumb || '',
        year: item.year || 'Unknown',
        genre: item.genre || [],
        style: item.style || [],
        id: item.id,
        title: item.title || 'Untitled',
      }));

      setReleases(releasesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="search-container flex justify-center items-start py-8 bg-gray-100 min-h-screen">
      <div className="container max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Search Form */}
        <div className="flex justify-center mb-8">
          <div className="w-full md:w-2/3">
            <SearchForm setSearchTerm={setSearchTerm} />
          </div>
        </div>

        {/* Search List */}
        {releases.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="w-full md:w-2/3">
              <SearchList releases={releases} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;