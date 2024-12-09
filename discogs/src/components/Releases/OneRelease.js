import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/OneRelease.css';
import InfoPanel from './InfoPanel';
import Tracks from './Tracks';
import Stats from './Stats';
import ManagementForm from './ManagementForm';

const OneRelease = () => {
    const [releaseData, setReleaseData] = useState(null); 
    const [record, setRecord] = useState({
        discogsId: 0,
        title: '',
        artist: '',
        releaseYear: 0,
        genre: '',
        styles: ''
    }); 
    const { id } = useParams();

    useEffect(() => {
        loadRelease();
    }, []); 

    const loadRelease = async () => {
        try {
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.discogs.com/releases/${id}`,
                params: {
                    token: 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl',
                },
            };

            const response = await axios.request(config);

            const {
                artists,
                formats,
                community,
                num_for_sale,
                lowest_price,
                title,
                released,
                notes,
                videos,
                genres,
                styles,
                tracklist,
                images,
            } = response.data;
            console.log(artists);
            setRecord({
                discogsId: Number(id),
                title: title || '',
                artist: Array.isArray(artists)
                    ? artists.map(artist => artist.name).join(', ')  // Extract the artist names and join them with commas
                    : '',  // If artists is not an array, default to empty string
                releaseYear: released ? new Date(released).getFullYear() : 0,
                genre: genres?.join(', ') || '',
                styles: styles?.join(', ') || ''
            });
            const structuredData = {
                artists: artists || [],
                formats: formats || [],
                rating: community?.rating?.average || 'No rating',
                numForSale: num_for_sale || 0,
                lowestPrice: lowest_price || 'N/A',
                title: title || 'Untitled',
                released: released || 'Unknown',
                notes: notes || 'No notes available',
                videos: videos || [],
                genres: genres || [],
                styles: styles || [],
                tracklist: tracklist || [],
                images: images || [],
            };

            setReleaseData(structuredData);
        } catch (error) {
            console.error('Error fetching release data:', error.response?.data || error.message);
        }
    };

    

    if (!releaseData) {
        return <p>Loading release data...</p>;
    }

    return (
        <div className='row'>
            <div className='col-3'>
                <InfoPanel releaseData={releaseData} />
            </div>
            <div className='col-8'>
                <div className=''>
                    <Stats releaseData={releaseData} />
                </div>
                <div className='text-center'>
                    <Tracks tracklist={releaseData.tracklist} />
                </div>
            </div>
            <hr />
            <div className='row'>
                <ManagementForm record={record} id={id}/>
            </div>
        </div>
    );
};

export default OneRelease;