import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../AuthContext';
import { useApi } from '../../utility/backSource';
import { useDiscogs } from '../../utility/dataSource';

const CollectionScreen = () => {
    const [collection, setCollection] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(1); // Default to "Uncategorized"
    const [syncing, setSyncing] = useState(false);
    const { authState } = useAuthContext();
    const { getData: getDiscogsData, deleteData: deleteDiscogsData } = useDiscogs();
    const { getData: getBackendData, updateData, deleteData: deleteBackendData, postData } = useApi();
    const userInitiatedSync = useRef(false);

    useEffect(() => {
        userInitiatedSync.current = false;
        loadFolders();
        syncCollection();
        // eslint-disable-next-line
    }, [selectedFolder]);

    const loadFolders = async () => {
        try {
            const foldersData = await getDiscogsData(`/users/${authState.username}/collection/folders`);
            setFolders(foldersData.folders || []);
        } catch (err) {
            console.error('Failed to load folders:', err);
        }
    };

    const syncCollection = async () => {
        setSyncing(true);
        try {
            console.log('Starting collection sync...');
            // Fetch collection from Discogs API
            const discogsData = await getDiscogsData(`/users/${authState.username}/collection/folders/${selectedFolder}/releases`);
            console.log('Raw Discogs data:', discogsData);
            
            const mapped = discogsData.releases.map(release => {
                console.log('Processing release:', release);
                
                // Safely extract artist names
                let artistNames = '';
                if (release.basic_information.artists && Array.isArray(release.basic_information.artists)) {
                    artistNames = release.basic_information.artists
                        .map(a => (a && typeof a === 'object' && a.name) ? a.name : '')
                        .filter(name => name !== '')
                        .join(', ');
                }
                
                // Safely extract genres
                let genres = '';
                if (release.basic_information.genres && Array.isArray(release.basic_information.genres)) {
                    genres = release.basic_information.genres
                        .map(g => (typeof g === 'string') ? g : '')
                        .filter(g => g !== '')
                        .join(', ');
                }
                
                // Ensure all values are strings, numbers, or null
                const mappedItem = {
                    discogs_id: release.basic_information.id || null,
                    instance_id: release.instance_id || null,
                    thumb: (typeof release.basic_information.thumb === 'string') ? release.basic_information.thumb : '',
                    title: (typeof release.basic_information.title === 'string') ? release.basic_information.title : '',
                    artist: artistNames,
                    genre: genres,
                    releaseYear: (typeof release.basic_information.year === 'number') ? release.basic_information.year.toString() : '',
                    styles: Array.isArray(release.basic_information.styles) 
                        ? release.basic_information.styles.join(', ')
                        : '',
                    notes: (typeof release.notes === 'string') ? release.notes : '',
                    rating: (typeof release.rating === 'number') ? release.rating : 0,
                    price_threshold: '',
                    cover: (typeof release.basic_information.cover_image === 'string') ? release.basic_information.cover_image : '',
                    folder_id: selectedFolder
                };
                
                console.log('Mapped item:', mappedItem);
                return mappedItem;
            });
            
            // Fetch backend collection for this user
            const backendCollection = await getBackendData(`/api/users/${authState.userId}/collection`);
            console.log('Backend collection:', backendCollection);
            
            // Merge backend fields into collection
            const merged = mapped.map(item => {
                const backendItem = backendCollection.find(b => b.discogs_id === item.discogs_id);
                const mergedItem = backendItem ? {
                    ...item,
                    notes: (typeof backendItem.notes === 'string') ? backendItem.notes : (item.notes || ''),
                    rating: (typeof backendItem.rating === 'number') ? backendItem.rating : (item.rating || 0),
                    price_threshold: (typeof backendItem.price_threshold === 'string' || typeof backendItem.price_threshold === 'number') ? backendItem.price_threshold.toString() : ''
                } : item;
                
                console.log('Merged item:', mergedItem);
                return mergedItem;
            });
            
            setCollection(merged);
            console.log('Final collection:', merged);
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

    const handleEditClick = async (discogsId, instanceId) => {
        const item = collection.find(i => i.discogs_id === discogsId && i.instance_id === instanceId);
        const newNotes = prompt('Edit notes:', item?.notes || '');
        if (newNotes === null) return;
        const newRatingStr = prompt('Edit rating (0-5):', item?.rating?.toString() || '0');
        if (newRatingStr === null) return;
        const newRating = parseInt(newRatingStr, 10);
        if (isNaN(newRating) || newRating < 0 || newRating > 5) {
            alert('Invalid rating. Must be 0-5.');
            return;
        }
        const newPriceThresholdStr = prompt('Edit price threshold:', item?.price_threshold?.toString() || '');
        if (newPriceThresholdStr === null) return;
        const newPriceThreshold = parseFloat(newPriceThresholdStr);
        if (isNaN(newPriceThreshold)) {
            alert('Invalid price threshold.');
            return;
        }
        try {
            console.log('Updating Discogs collection:', {
                endpoint: `/users/${authState.username}/collection/folders/${selectedFolder}/releases/${discogsId}/instances/${instanceId}`,
                method: 'PUT',
                data: {
                    notes: newNotes,
                    rating: newRating
                },
                notes: newNotes,
                rating: newRating
            });
            
            // Update rating and notes on Discogs
            // TODO: Discogs API update is currently failing with 405 error
            // Need to investigate correct endpoint for updating collection items
            // For now, just update the backend database
            /*
            const discogsResp = await putDiscogsData(`/users/${authState.username}/collection/folders/${selectedFolder}/releases/${discogsId}/instances/${instanceId}`, {
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
                    wishlist: 0
                });
            }
            console.log('Backend response:', backendResp);
            
            // Update UI
            setCollection(collection.map(item =>
                (item.discogs_id === discogsId && item.instance_id === instanceId)
                    ? { ...item, notes: newNotes, rating: newRating, price_threshold: newPriceThreshold }
                    : item
            ));
        } catch (err) {
            console.error('Failed to update item:', err);
            alert('Failed to update item.');
        }
    };

    const handleDeleteClick = async (discogsId, instanceId) => {
        try {
            console.log('Deleting from Discogs collection:', {
                endpoint: `/users/${authState.username}/collection/folders/${selectedFolder}/releases/${discogsId}/instances/${instanceId}`,
                discogsId,
                instanceId
            });
            
            // Delete from Discogs API
            const discogsResp = await deleteDiscogsData(`/users/${authState.username}/collection/folders/${selectedFolder}/releases/${discogsId}/instances/${instanceId}`);
            console.log('Discogs DELETE response:', discogsResp);
            
            console.log('Deleting from backend:', {
                endpoint: `/api/users/${authState.userId}/collection/${discogsId}`,
                discogsId
            });
            
            // Delete from backend database
            const backendResp = await deleteBackendData(`/api/users/${authState.userId}/collection/${discogsId}`);
            console.log('Backend DELETE response:', backendResp);
            
            // Update UI
            setCollection(collection.filter(item => !(item.discogs_id === discogsId && item.instance_id === instanceId)));
        } catch (err) {
            console.error('Failed to delete item:', err);
            alert('Failed to delete item from collection.');
        }
    };

    const handleSyncClick = () => {
        userInitiatedSync.current = true;
        syncCollection();
    };

    // Helper function to safely convert any value to a string
    const safeToString = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value.toString();
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') {
            console.warn('Attempting to render object:', value);
            console.warn('Object keys:', Object.keys(value));
            console.warn('Object values:', Object.values(value));
            if (value.field_id && value.value) {
                console.warn('Found field_id/value object:', value);
                return `[${value.field_id}: ${value.value}]`;
            }
            return '[Object]';
        }
        return String(value);
    };

    const renderCollectionItems = () => {
        return collection.map((item) => (
            <tr key={`${item.discogs_id}-${item.instance_id}`}>
                <th scope="row">{safeToString(item.discogs_id)}</th>
                <td>{safeToString(item.instance_id)}</td>
                <td>
                    {item.thumb ? (
                        <img src={item.thumb} alt={safeToString(item.title)} style={{width: '50px', height: '50px'}} />
                    ) : (
                        <span>No image</span>
                    )}
                </td>
                <td>{safeToString(item.title)}</td>
                <td>{safeToString(item.artist)}</td>
                <td>{safeToString(item.genre)}</td>
                <td>{safeToString(item.notes)}</td>
                <td>{safeToString(item.rating)}</td>
                <td>{safeToString(item.price_threshold)}</td>
                <td>
                    <button 
                        type='button' 
                        className='btn btn-primary btn-sm' 
                        onClick={() => handleEditClick(item.discogs_id, item.instance_id)}>
                        EDIT
                    </button>
                </td>
                <td>
                    <button 
                        type='button' 
                        className='btn btn-danger btn-sm' 
                        onClick={() => handleDeleteClick(item.discogs_id, item.instance_id)}>
                        DELETE
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <h1 className='mx-5'>
                <u>{authState.username}'s Collection!</u>
            </h1>
            <div className='mx-5 my-2'>
                <select 
                    className='form-select d-inline-block w-auto me-3' 
                    value={selectedFolder} 
                    onChange={(e) => setSelectedFolder(parseInt(e.target.value))}>
                    {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name} ({folder.count} items)
                        </option>
                    ))}
                </select>
                <button className='btn btn-success' onClick={handleSyncClick} disabled={syncing}>
                    {syncing ? 'Syncing...' : 'Sync with Discogs'}
                </button>
                <small className='text-muted ms-2'>
                    Note: Discogs API has rate limits. Large collections may take time to sync.
                </small>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Discogs #</th>
                        <th scope="col">Instance #</th>
                        <th scope="col">Cover</th>
                        <th scope="col">Title</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Price Threshold</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCollectionItems()}
                </tbody>
            </table>
        </div>
    );
};

export default CollectionScreen;
