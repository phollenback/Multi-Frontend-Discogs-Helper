import React, { useState } from 'react';
import { useAuthContext } from '../../AuthContext';
import { useDiscogs } from '../../utility/dataSource'; 
import { useApi } from '../../utility/backSource'; 

const WantlistForm = (props) => {
    const { updateData: updateDiscogs } = useDiscogs();
    const { postData: postToBackend } = useApi(); 
    const { authState } = useAuthContext();
    const [wantlistData, setWantlistData] = useState({
        notes: '',
        rating: 0,
        price_threshold: 0,
    });

    // Add item to the Discogs wantlist
    const addToDiscogsWantlist = async () => {
        console.log("[WantlistForm][addToDiscogsWantlist]");
        try {
            const endpoint = `/users/${authState.username}/wants/${props.id}`;
            const data = {
                notes: wantlistData.notes,
                rating: wantlistData.rating,
                price_threshold: wantlistData.price_threshold,
            };
            const response = await updateDiscogs(endpoint, data); // Post to Discogs API
            console.log(response);
            return true;
        } catch (error) {
            console.error("Error adding to Discogs wantlist");
            return false;
        }
    };

    
    const addToBackend = async () => {
        console.log("[WantlistForm][addToBackend]");

        let recordResponse;
        let backResponse;
        try {
            // Post the record data to the backend using useApi.postData
            recordResponse = await postToBackend(`/api/records`, props.record); 
            console.log('Record Response:', recordResponse.data);

            // Prepare data to send to the backend
            const body = {
                userId: authState.userId,
                discogsId: Number(props.id),
                rating: Number(wantlistData.rating),
                notes: wantlistData.notes,
                price_threshold: Number(wantlistData.price_threshold),
                wishlist: 0,
            };
            console.log('Backend Body:', body);

            // Post to the backend system using useApi.postData
            backResponse = await postToBackend(`/api/users/${authState.userId}/collection`, body);
            console.log('Backend Response:', backResponse.data);
            return true;
        } catch (error) {
            console.error('Error during backend request:', error);
            return false;
        }
    };

    // Handle button click to add item to both Discogs and backend
    const handleWantlistClick = async () => {
        if (!authState.username) {
            alert("Sign in to use this feature.");
            return;
        }

        const discogsResponse = await addToDiscogsWantlist();
        const backResponse = await addToBackend();

        if (backResponse && discogsResponse) {
            alert("Wantlist item added successfully.");
        } else {
            alert("Not added successfully.");
        }
    };

    // Handle form changes for wantlist data
    const handleWantlistChange = (e) => {
        const { name, value } = e.target;
        setWantlistData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className='col-6'>
            <button onClick={handleWantlistClick} className='btn btn-primary w-100'>
                Add To Wantlist
            </button>
            <form>
                <div>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={wantlistData.notes}
                        onChange={handleWantlistChange}
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
                        value={wantlistData.rating}
                        onChange={handleWantlistChange}
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Price Threshold:</label>
                    <input
                        type="number"
                        name="price_threshold"
                        value={wantlistData.price_threshold}
                        onChange={handleWantlistChange}
                        className="form-control"
                    />
                </div>
            </form>
        </div>
    );
};

export default WantlistForm;