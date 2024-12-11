import React, { useState, useEffect } from 'react';
import '../../styles/SearchScreen.css';
import SearchForm from './SearchForm';
import SearchList from './SearchList';
import axios from 'axios';
import { getData } from '../../utility/dataSource';

const SearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        if (searchTerm !== "") {
            loadResults(searchTerm);
        }
      });

      const loadResults = async () => {
        try {
          // console.log('in LOADRESULTS')
            const response = await axios.get('https://api.discogs.com/database/search', {
              params: {
                q: searchTerm,
                token: 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl',
                type: 'release',
              },
            });
            
            // Extract the relevant data
            const releasesData = response.data.results.map((item) => ({
                thumb: item.thumb || '',
                year: item.year || 'Unknown',
                genre: item.genre || [],
                style: item.style || [],
                id: item.id,
                title: item.title || 'Untitled',
            }));
        
            // Set the releases data
            setReleases(releasesData);
            console.log(releasesData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      

  return (
    <div className="search-container d-flex justify-content-center align-items-start">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <SearchForm setSearchTerm={setSearchTerm}/>
          </div>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-8">
            <SearchList releases={releases}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;