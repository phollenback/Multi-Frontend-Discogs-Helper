import React, { useState }  from 'react';
import { useAuthContext } from '../../AuthContext';
import { postData } from '../../utility/dataSource';


const CollectionForm = ({id, title}) => {
    const { authState } = useAuthContext();
    const [collectionData, setCollectionData] = useState({
        notes: '',
        rating: 0,
        price_threshold: 0,
    });

    const handleOwnClick = async () => {
        if (!authState.username) {
            alert("Sign in to use this feature.");
            return;
        }
        try {
            const endpoint = `/users/${authState.username}/collection/folders/1/releases/${id}`;
            const data = {
                notes: collectionData.notes,   
                rating: collectionData.rating,
                price_threshold: collectionData.price_threshold,
            };

            const response = await postData(endpoint, data);
            console.log(response);

            if (response.basic_information.title === title) {
                alert("Collection item added successfully.");
            } else {
                alert("Collection item not added.");
            }
        } catch (error) {
            console.error("Error adding to collection");
            alert("There was an unexpected error when adding to the collection.");
        }
    };

    

    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCollectionData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  return (
    <div className='col-6'>
        <button onClick={handleOwnClick} className='btn btn-success w-100' >
                        Already Own
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
  )
}

export default CollectionForm
