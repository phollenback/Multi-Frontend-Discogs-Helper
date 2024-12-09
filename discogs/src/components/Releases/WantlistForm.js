import React, {useState} from 'react';
import { useAuthContext } from '../../AuthContext';
//import { postData } from '../../utility/dataSource';
import { useApi } from '../../utility/backSource';
import axios from 'axios';



const WantlistForm = (props) => {
    const { postData } = useApi();
    const { authState } = useAuthContext();
    const [wantlistData, setWantlistData] = useState({
        notes: '',
        rating: 0,
        price_threshold: 0,
    });

    // const addToDiscogsWantlist = async () => {
    //     console.log("[WantlistForm][addtodiscogswantlist]")
    //     try {
    //         const endpoint = `/users/${authState.username}/wants/${props.id}`;
    //         const data = {
    //             notes: wantlistData.notes,   
    //             rating: wantlistData.rating,
    //             price_threshold: wantlistData.price_threshold,
    //         };
    //         const response = await postData(endpoint, data);
    //         console.log(response);
    //         return true;
    //     } catch (error) {
    //         console.error("Error adding to want list");
    //         return false;
    //     }
    // }
    const addToBackend = async () => {
        console.log("[WantlistForm][addToBackend]")

        let recordResponse
        let backResponse;
        try {
            
            recordResponse = await postData(`/api/records`, props.record);
            console.log('Response:', recordResponse.data); 

            const body = {
                            userId: authState.userId,
                            discogsId: Number(props.id),
                            rating: Number(wantlistData.rating),
                            notes: wantlistData.notes,   
                            price_threshold: Number(wantlistData.price_threshold),
                            wishlist: 0
            }
            console.log(body);
            backResponse = await axios.post(`http://localhost:3000/api/users/${authState.userId}/collection`, body);
            console.log('Response:', backResponse.data); 
            return true;
        } catch (error) {
            console.error('Error during request:', error); // Handle error
            return false;
        }

    }

    const handleWantlistClick = async () => {
        if (!authState.username) {
            alert("Sign in to use this feature.");
            return;
        }

      //  const discogsResponse = await addToDiscogsWantlist();
        const backResponse = await addToBackend();

        if (backResponse) {
            alert("Wantlist item added successfully.");
        } else {
            alert("Not added successfully.");
        }
        
    };

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
  )
}

export default WantlistForm
