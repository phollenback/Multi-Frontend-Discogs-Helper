import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../AuthContext';
import { useApi } from '../../utility/backSource';

const RatingScreen = () => {
    const [collection, setCollection] = useState([]);
    const [wantlist, setWantlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingFilter, setRatingFilter] = useState('all'); // 'all', 'rated', 'unrated'
    const [sortBy, setSortBy] = useState('title'); // 'title', 'artist', 'rating', 'date_added'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [activeTab, setActiveTab] = useState('collection'); // 'collection', 'wantlist'
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');
    
    const { authState } = useAuthContext();
    const { getData, updateData, postData } = useApi();

    useEffect(() => {
        loadData();
    }, [authState.userId]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async () => {
        try {
            setLoading(true);
            // Load both collection and wantlist
            const [collectionData, wantlistData] = await Promise.all([
                getData(`/api/users/${authState.userId}/collection`),
                getData(`/api/users/${authState.userId}/wantlist`)
            ]);
            setCollection(collectionData);
            setWantlist(wantlistData);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = async (discogsId, newRating) => {
        try {
            const currentData = activeTab === 'collection' ? collection : wantlist;
            const item = currentData.find(item => item.discogs_id === discogsId);
            if (!item) return;

            // Update in backend
            await updateData(`/api/users/${authState.userId}/collection/${discogsId}`, {
                rating: newRating,
                notes: item.notes || '',
                price_threshold: item.price_threshold || '0',
                wishlist: activeTab === 'wantlist' ? 1 : 0
            });

            // Update local state for both collection and wantlist
            const updateItem = (prev) => 
                prev.map(item => 
                    item.discogs_id === discogsId 
                        ? { ...item, rating: newRating }
                        : item
                );

            setCollection(updateItem);
            setWantlist(updateItem);
        } catch (err) {
            console.error('Error updating rating:', err);
            alert('Failed to update rating. Please try again.');
        }
    };

    const handleSyncWithDiscogs = async () => {
        if (!authState.username) {
            alert('Discogs username not found. Please log in again.');
            return;
        }

        setSyncing(true);
        setSyncMessage('Syncing with Discogs...');
        
        try {
            const response = await postData(`/api/users/${authState.userId}/sync-discogs`, {
                username: authState.username
            });
            
            setSyncMessage(`Successfully synced ${response.syncedCount} items from Discogs!`);
            
            // Reload data after sync
            await loadData();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setSyncMessage('');
            }, 5000);
            
        } catch (err) {
            console.error('Error syncing with Discogs:', err);
            setSyncMessage('Failed to sync with Discogs. Please try again.');
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                setSyncMessage('');
            }, 5000);
        } finally {
            setSyncing(false);
        }
    };

    const getFilteredAndSortedData = () => {
        const currentData = activeTab === 'collection' ? collection : wantlist;
        let filtered = currentData;

        // Apply rating filter
        if (ratingFilter === 'rated') {
            filtered = filtered.filter(item => item.rating && item.rating > 0);
        } else if (ratingFilter === 'unrated') {
            filtered = filtered.filter(item => !item.rating || item.rating === 0);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'title':
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
                    break;
                case 'artist':
                    aValue = a.artist?.toLowerCase() || '';
                    bValue = b.artist?.toLowerCase() || '';
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                case 'date_added':
                    aValue = new Date(a.created_at || 0);
                    bValue = new Date(b.created_at || 0);
                    break;
                default:
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    };

    const renderStars = (currentRating, discogsId) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= currentRating ? 'filled' : ''}`}
                    onClick={() => handleRatingChange(discogsId, i)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1.5em',
                        color: i <= currentRating ? '#ffc107' : '#e4e5e9',
                        marginRight: '2px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const getRatingStats = () => {
        const currentData = activeTab === 'collection' ? collection : wantlist;
        const rated = currentData.filter(item => item.rating && item.rating > 0);
        const unrated = currentData.filter(item => !item.rating || item.rating === 0);
        const avgRating = rated.length > 0 
            ? (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1)
            : 0;

        return { 
            total: currentData.length,
            rated: rated.length, 
            unrated: unrated.length, 
            avgRating 
        };
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading your collection...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    const stats = getRatingStats();
    const filteredData = getFilteredAndSortedData();

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">
                        <i className="fas fa-star me-2"></i>
                        Rate Your Items
                    </h1>
                    
                    {/* Tab Navigation */}
                    <ul className="nav nav-tabs mb-4" id="ratingTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`}
                                onClick={() => setActiveTab('collection')}
                                type="button"
                            >
                                <i className="fas fa-music me-2"></i>
                                Collection ({collection.length})
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'wantlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('wantlist')}
                                type="button"
                            >
                                <i className="fas fa-heart me-2"></i>
                                Wantlist ({wantlist.length})
                            </button>
                        </li>
                    </ul>
                    
                    {/* Sync Section */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="card-title mb-1">
                                                <i className="fas fa-sync-alt me-2"></i>
                                                Sync with Discogs
                                            </h5>
                                            <p className="card-text text-muted mb-0">
                                                Import your collection and wantlist from Discogs to start rating your items.
                                            </p>
                                        </div>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleSyncWithDiscogs}
                                            disabled={syncing}
                                        >
                                            {syncing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Syncing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sync-alt me-2"></i>
                                                    Sync Now
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {syncMessage && (
                                        <div className={`alert ${syncMessage.includes('Successfully') ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="alert">
                                            {syncMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Items</h5>
                                    <h3>{stats.total}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Rated</h5>
                                    <h3>{stats.rated}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Unrated</h5>
                                    <h3>{stats.unrated}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Avg Rating</h5>
                                    <h3>{stats.avgRating}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Sorting */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="ratingFilter" className="form-label">Filter by Rating:</label>
                            <select 
                                className="form-select" 
                                id="ratingFilter"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                            >
                                <option value="all">All Items</option>
                                <option value="rated">Rated Items</option>
                                <option value="unrated">Unrated Items</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="sortBy" className="form-label">Sort by:</label>
                            <select 
                                className="form-select" 
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="title">Title</option>
                                <option value="artist">Artist</option>
                                <option value="rating">Rating</option>
                                <option value="date_added">Date Added</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="sortOrder" className="form-label">Order:</label>
                            <select 
                                className="form-select" 
                                id="sortOrder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="row">
                        {filteredData.length === 0 ? (
                            <div className="col-12">
                                <div className="alert alert-info" role="alert">
                                    {ratingFilter === 'all' 
                                        ? `No items in your ${activeTab} yet.` 
                                        : `No ${ratingFilter} items found in your ${activeTab}.`
                                    }
                                </div>
                            </div>
                        ) : (
                            filteredData.map((item) => (
                                <div key={item.discogs_id} className="col-md-6 col-lg-4 mb-3">
                                    <div className="card h-100">
                                        <div className="row g-0">
                                            <div className="col-4">
                                                <Link to={`/release/${item.discogs_id}`}>
                                                    <img 
                                                        src={(() => {
                                                            const imgUrl = item.thumb_url || item.cover_image_url || 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
                                                            console.log(`Image for ${item.title}: ${imgUrl}`);
                                                            return imgUrl;
                                                        })()}
                                                        className="img-fluid rounded-start" 
                                                        alt={item.title || 'Album cover'}
                                                        style={{
                                                            objectFit: 'cover', 
                                                            minHeight: '120px',
                                                            width: '100%',
                                                            height: '100%',
                                                            cursor: 'pointer'
                                                        }}
                                                        onError={(e) => {
                                                            console.log(`Image failed to load for ${item.title}:`, e.target.src);
                                                            e.target.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col-8">
                                                <div className="card-body p-2">
                                                    <h6 className="card-title mb-1" style={{fontSize: '0.9em'}}>
                                                        <Link 
                                                            to={`/release/${item.discogs_id}`}
                                                            className="text-decoration-none text-dark"
                                                            style={{fontSize: '0.9em'}}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </h6>
                                                    <p className="card-text mb-1" style={{fontSize: '0.8em', color: '#666'}}>
                                                        {item.artist}
                                                    </p>
                                                    <p className="card-text mb-2" style={{fontSize: '0.7em', color: '#888'}}>
                                                        {item.release_year}
                                                    </p>
                                                    
                                                    {/* Rating Stars */}
                                                    <div className="mb-2">
                                                        <div style={{fontSize: '0.8em', marginBottom: '2px'}}>
                                                            Your Rating:
                                                        </div>
                                                        {renderStars(item.rating || 0, item.discogs_id)}
                                                    </div>

                                                    {/* Current Rating Display */}
                                                    {item.rating && item.rating > 0 && (
                                                        <small className="text-muted">
                                                            Rated: {item.rating}/5
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingScreen;
