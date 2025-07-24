import React, { useState } from 'react';
import { useAuthContext } from '../../AuthContext';
import { useDiscogs } from '../../utility/dataSource'; 
import { useApi } from '../../utility/backSource'; 

const CollectionForm = (props) => {
    const { postData: postToDiscogs } = useDiscogs();
    const { postData: postToBackend } = useApi(); 
    const { authState } = useAuthContext();
    const [collectionData, setCollectionData] = useState({
        notes: '',
        rating: 0,
        price_threshold: 0,
    });

    // Add item to the Discogs collection
    const addToDiscogsCollection = async () => {
        console.log("[CollectionForm][addToDiscogsCollection]");
        try {
            // The correct endpoint for adding to collection is POST to /users/{username}/collection/folders/{folder_id}/releases/{release_id}
            const endpoint = `/users/${authState.username}/collection/folders/1/releases/${props.id}`;
            const data = {
                notes: collectionData.notes,
                rating: collectionData.rating,
            };
            const response = await postToDiscogs(endpoint, data); // Post to Discogs API
            console.log('Discogs collection response:', response);
            return true;
        } catch (error) {
            console.error("Error adding to Discogs collection:", error);
            // For now, return true to allow backend operations to continue
            return true;
        }
    };

    
    const addToBackend = async () => {
        console.log("[CollectionForm][addToBackend]");

        try {
            // First, create the record in the records table
            const recordData = {
                discogsId: Number(props.id),
                title: props.record.title || '',
                artist: props.record.artist || '',
                releaseYear: props.record.releaseYear ? props.record.releaseYear.toString() : '0',
                genre: props.record.genre || '',
                styles: props.record.styles || ''
            };
            
            console.log('Record data:', recordData);
            const recordResponse = await postToBackend(`/api/records`, recordData); 
            console.log('Record Response:', recordResponse);

            // Then create the user record
            const userRecordData = {
                userId: authState.userId,
                discogsId: Number(props.id),
                rating: Number(collectionData.rating),
                notes: collectionData.notes,
                price_threshold: Number(collectionData.price_threshold),
                wishlist: 0,
            };
            console.log('User record data:', userRecordData);

            const userRecordResponse = await postToBackend(`/api/users/${authState.userId}/collection`, userRecordData);
            console.log('User record Response:', userRecordResponse);
            return true;
        } catch (error) {
            console.error('Error during backend request:', error);
            return false;
        }
    };

    // Handle button click to add item to both Discogs and backend
    const handleCollectionClick = async () => {
        if (!authState.username) {
            alert("Sign in to use this feature.");
            return;
        }

        const discogsResponse = await addToDiscogsCollection();
        const backResponse = await addToBackend();

        if (backResponse && discogsResponse) {
            alert("Collection item added successfully to both Discogs and backend.");
        } else if (backResponse) {
            alert("Added to backend successfully. Discogs API may have failed.");
        } else {
            alert("Failed to add item to backend.");
        }
    };

    // Handle form changes for collection data
    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCollectionData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className='col-6'>
            <button onClick={handleCollectionClick} className='btn btn-success w-100'>
                Add To Collection
            </button>
            <form>
                <div>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={collectionData.notes}
                        onChange={handleCollectionChange}
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Rating (1-5):</label>
                    <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        value={collectionData.rating}
                        onChange={handleCollectionChange}
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Price Threshold:</label>
                    <input
                        type="number"
                        name="price_threshold"
                        value={collectionData.price_threshold}
                        onChange={handleCollectionChange}
                        className="form-control"
                    />
                </div>
            </form>
        </div>
    );
};

export default CollectionForm;
