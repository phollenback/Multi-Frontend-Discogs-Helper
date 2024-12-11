import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../utility/backSource'

const WantlistScreen = () => {
    const [wantlist, setWantlist] = useState([]);
    const { authState } = useAuthContext();
    const navigate = useNavigate(); 
    const { getData, deleteData } = useApi();

    useEffect(() => {
        if(authState.userId === ""){
            return;
        }
        loadWantlist();
    }, []);

    const loadWantlist = async () => {
       const response = await getData(`/api/users/${authState.userId}/collection`)

       setWantlist(response);
    };

    const renderWantlistItems = () => {
        return wantlist.map((item) => (
            <tr key={item.discogs_id}>
                <th scope="row">{item.discogs_id}</th>
                <td>{/* Add image tag here for cover */}</td>
                <td>{item.title}</td>
                <td>{item.artist}</td>
                <td>{item.genre}</td>
                <td>{item.notes}</td>
                <td>{item.rating}</td>
                <td>{item.price_threshold}</td>
                <td>
                    <button 
                        type='button' 
                        className='btn btn-primary' 
                        onClick={() => handleEditClick(item.discogs_id)}>
                        EDIT
                    </button>
                </td>
                <td>
                    <button 
                        type='button' 
                        className='btn btn-primary' 
                        onClick={() => handleDeleteClick(item.discogs_id)}>
                        DELETE
                    </button>
                </td>
            </tr>
        ));
    };
    
    const handleEditClick = (discogs_id) => {
        // Use the discogs_id to navigate to the edit page
        navigate(`/edit/${discogs_id}`);
    };
    
    const handleDeleteClick = async (discogsId) => {
        // Use the discogs_id to handle the delete action
        console.log("Delete item with discogs_id:", discogsId);
        // Add your delete logic here
        const response = await deleteData(`/api/users/${authState.userId}/collection/${discogsId}`);
        
        console.log(response);

        alert('Album delete successfully!')
    };

    return (
        <div>
            <h1 className='mx-5'>
                <u>{authState.username}'s Wantlist!</u>
            </h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Discogs #</th>
                        <th scope="col">Cover</th>
                        <th scope="col">Title</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Price Threshold</th>
                    </tr>
                </thead>
                <tbody>
                    {renderWantlistItems()}
                </tbody>
            </table>
        </div>
    );
};

export default WantlistScreen;;