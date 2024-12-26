"use client"

import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi'; // Assuming this is a custom hook for API calls

// Define the structure of a WantlistItem
interface WantlistItem {
  user_id: number;
  discogs_id: number;
  title: string;
  artist: string;
  release_year: number;
  genre: string;
  styles: string;
  notes: string;
  price_threshold: number;
  rating: number;
  wishlist: number;
}

const WantlistScreen = () => {
  const [wantlist, setWantlist] = useState<WantlistItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { getData } = useApi();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/getUserId'); // Call the server-side API route
        const data = await response.json();
        setUserId(data.userId); // Set the userId
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadWantlist(userId); // Load the wantlist if userId is available
    }
  }, [userId]);

  const loadWantlist = async (userId: number) => {
    try {
      const response = await getData<WantlistItem[]>(`/api/users/${userId}/collection`);
      setWantlist(response); // Now TypeScript knows this is an array of WantlistItem
    } catch (error) {
      console.error('Failed to load wantlist:', error);
    }
  };

  const renderWantlistItems = () => {
    return wantlist.map((item) => (
      <tr key={item.discogs_id}>
        <td className="border px-4 py-2">{item.discogs_id}</td>
        <td className="border px-4 py-2">
          {/* Optional: Add image tag for cover here */}
        </td>
        <td className="border px-4 py-2">{item.title}</td>
        <td className="border px-4 py-2">{item.artist}</td>
        <td className="border px-4 py-2">{item.genre}</td>
        <td className="border px-4 py-2">{item.notes}</td>
        <td className="border px-4 py-2">{item.rating}</td>
        <td className="border px-4 py-2">{item.price_threshold}</td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {userId ? `${userId}'s Wantlist` : "Loading..."}
      </h1>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Discogs #</th>
            <th className="border px-4 py-2">Cover</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Artist</th>
            <th className="border px-4 py-2">Genre</th>
            <th className="border px-4 py-2">Notes</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Price Threshold</th>
          </tr>
        </thead>
        <tbody>{renderWantlistItems()}</tbody>
      </table>
    </div>
  );
};

export default WantlistScreen;