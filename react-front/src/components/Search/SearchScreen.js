import React, { useState, useEffect } from 'react';
import '../../styles/SearchScreen.css';
import SearchForm from './SearchForm';
import SearchList from './SearchList';
import axios from 'axios';
import { getData } from '../../utility/dataSource';
import { useDiscogs } from '../../utility/dataSource';
import { useApi } from '../../utility/backSource';
import { useAuthContext } from '../../AuthContext';

const SearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [releases, setReleases] = useState([]);
    const { putData: putDiscogsData } = useDiscogs();
    const { updateData } = useApi();
    const { authState } = useAuthContext();

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
      

  const handleAddToWantlist = async (release) => {
        try {
            // Add to Discogs wantlist
            await putDiscogsData(`/users/${authState.username}/wants/${release.id}`);
            // Upsert to backend for custom fields
            await updateData(`/api/users/${authState.userId}/collection/${release.id}`, {
                rating: 0,
                notes: '',
                price_threshold: ''
            });
            alert('Added to wantlist!');
        } catch (err) {
            alert('Failed to add to wantlist.');
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
            <SearchList releases={releases} onAddToWantlist={handleAddToWantlist}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;