import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../AuthContext';
import { useApi } from '../../utility/backSource'
import { useDiscogs } from '../../utility/dataSource';

const WantlistScreen = () => {
    const [wantlist, setWantlist] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const { authState } = useAuthContext();
    // Remove all backend fetching
    // const { getData, deleteData, postData } = useApi();
    const { getData: getDiscogsData, deleteData: deleteDiscogsData } = useDiscogs();
    const { getData: getBackendData, updateData, deleteData: deleteBackendData, postData } = useApi();
    const userInitiatedSync = useRef(false);

    useEffect(() => {
        userInitiatedSync.current = false;
        syncWithDiscogs();
        // eslint-disable-next-line
    }, []);

    // Remove handleDeleteClick and handleEditClick if they depend on backend

    const renderWantlistItems = () => {
        return wantlist.map((item) => (
            <tr key={item.discogs_id}>
                <th scope="row">{item.discogs_id}</th>
                <td><img src={item.thumb} alt={item.title} /></td>
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
    
    const handleEditClick = async (discogsId) => {
        // Prompt user for new notes, rating, and price threshold
        const item = wantlist.find(i => i.discogs_id === discogsId);
        const newNotes = prompt('Edit notes:', item?.notes || '');
        if (newNotes === null) return; // Cancelled
        const newRatingStr = prompt('Edit rating (0-5):', item?.rating?.toString() || '0');
        if (newRatingStr === null) return; // Cancelled
        const newRating = parseInt(newRatingStr, 10);
        if (isNaN(newRating) || newRating < 0 || newRating > 5) {
            alert('Invalid rating. Must be 0-5.');
            return;
        }
        const newPriceThresholdStr = prompt('Edit price threshold:', item?.price_threshold?.toString() || '');
        if (newPriceThresholdStr === null) return; // Cancelled
        const newPriceThreshold = parseFloat(newPriceThresholdStr);
        if (isNaN(newPriceThreshold)) {
            alert('Invalid price threshold.');
            return;
        }
        try {
            console.log('Updating Discogs:', {
                endpoint: `/users/pskills/wants/${discogsId}?notes=${encodeURIComponent(newNotes)}&rating=${newRating}`,
                notes: newNotes,
                rating: newRating
            });
            // TODO: Discogs API update is currently failing with 405 error
            // Need to investigate correct endpoint for updating wantlist items
            // For now, just update the backend database
            /*
            const discogsResp = await putDiscogsData(`/users/pskills/wants/${discogsId}`, {
                notes: newNotes,
                rating: newRating
            });
            console.log('Discogs PUT response:', discogsResp);
            */
            
            // Check if item exists in backend collection
            const backendCollection = await getBackendData(`/api/users/${authState.userId}/collection`);
            const existingItem = backendCollection.find(b => b.discogs_id === discogsId);
            
            let backendResp;
            if (existingItem) {
                // Update existing item
                console.log('Updating existing backend item:', {
                    endpoint: `/api/users/${authState.userId}/collection/${discogsId}`,
                    price_threshold: newPriceThreshold,
                    rating: newRating,
                    notes: newNotes
                });
                backendResp = await updateData(`/api/users/${authState.userId}/collection/${discogsId}`, { 
                    price_threshold: newPriceThreshold, 
                    rating: newRating, 
                    notes: newNotes 
                });
            } else {
                // Create new item
                console.log('Creating new backend item:', {
                    endpoint: `/api/users/${authState.userId}/collection`,
                    discogsId: discogsId,
                    price_threshold: newPriceThreshold,
                    rating: newRating,
                    notes: newNotes
                });
                backendResp = await postData(`/api/users/${authState.userId}/collection`, {
                    userId: authState.userId,
                    discogsId: discogsId,
                    title: item.title || '',
                    artist: item.artist || '',
                    genre: item.genre || '',
                    releaseYear: item.releaseYear || '',
                    styles: item.styles || '',
                    rating: newRating,
                    notes: newNotes,
                    price_threshold: newPriceThreshold,
                    wishlist: 1
                });
            }
            console.log('Backend response:', backendResp);
            
            // Update UI
            setWantlist(wantlist.map(item =>
                item.discogs_id === discogsId
                    ? { ...item, notes: newNotes, rating: newRating, price_threshold: newPriceThreshold }
                    : item
            ));
        } catch (err) {
            console.error('Failed to update item:', err);
            alert('Failed to update item.');
        }
    };
    
    const handleDeleteClick = async (discogsId) => {
        try {
            console.log('Deleting from Discogs wantlist:', {
                endpoint: `/users/${authState.username}/wants/${discogsId}`,
                discogsId
            });
            
            // Delete from Discogs API
            const discogsResp = await deleteDiscogsData(`/users/${authState.username}/wants/${discogsId}`);
            console.log('Discogs DELETE response:', discogsResp);
            
            console.log('Deleting from backend:', {
                endpoint: `/api/users/${authState.userId}/collection/${discogsId}`,
                discogsId
            });
            
            // Delete from backend database
            const backendResp = await deleteBackendData(`/api/users/${authState.userId}/collection/${discogsId}`);
            console.log('Backend DELETE response:', backendResp);
            
            // Update UI
            setWantlist(wantlist.filter(item => item.discogs_id !== discogsId));
        } catch (err) {
            console.error('Failed to delete item:', err);
            alert('Failed to delete item from Discogs wantlist.');
        }
    };

    const syncWithDiscogs = async () => {
        setSyncing(true);
        try {
            // Fetch wantlist from Discogs API
            const discogsData = await getDiscogsData('/users/pskills/wants');
            const mapped = discogsData.wants.map(w => ({
                discogs_id: w.basic_information.id,
                thumb: w.basic_information.thumb,
                title: w.basic_information.title,
                artist: w.basic_information.artists.map(a => a.name).join(', '),
                genre: w.basic_information.genres?.join(', '),
                releaseYear: (typeof w.basic_information.year === 'number') ? w.basic_information.year.toString() : '',
                styles: Array.isArray(w.basic_information.styles) 
                    ? w.basic_information.styles.join(', ')
                    : '',
                notes: w.notes,
                rating: w.rating,
                price_threshold: '',
                cover: w.basic_information.cover_image
            }));
            
            // Fetch backend collection for this user
            const backendCollection = await getBackendData(`/api/users/${authState.userId}/collection`);
            console.log('Backend collection:', backendCollection);
            
            // Merge backend fields into wantlist
            const merged = mapped.map(item => {
                const backendItem = backendCollection.find(b => b.discogs_id === item.discogs_id);
                return backendItem ? {
                    ...item,
                    notes: backendItem.notes || item.notes,
                    rating: backendItem.rating || item.rating,
                    price_threshold: backendItem.price_threshold || ''
                } : item;
            });
            
            setWantlist(merged);
            console.log('Merged wantlist:', merged);
            if (userInitiatedSync.current) {
                alert('Synced with Discogs!');
            }
        } catch (err) {
            console.error('Sync error:', err);
            alert('Failed to sync with Discogs.');
        } finally {
            setSyncing(false);
        }
    };

    const handleSyncClick = () => {
        userInitiatedSync.current = true;
        syncWithDiscogs();
    };

    return (
        <div>
            <h1 className='mx-5'>
                <u>{authState.username}'s Wantlist!</u>
            </h1>
            <button className='btn btn-success mx-5 my-2' onClick={handleSyncClick} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync with Discogs'}
            </button>
            <small className='text-muted ms-2'>
                Note: Discogs API has rate limits. Large wantlists may take time to sync.
            </small>
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