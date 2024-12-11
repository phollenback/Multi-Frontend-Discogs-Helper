import { useState } from "react";
import axios from "axios";

// Create the Axios instance with base URL for Discogs API
const api = axios.create({
    baseURL: 'https://api.discogs.com'
});

// Add token interceptor
api.interceptors.request.use(
    (config) => {
        const token = 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl';
        if (token) {
            config.params = {
                ...config.params, // Retain existing params, if any
                token: token      // Add the token as a query parameter
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Custom hook to interact with Discogs API
export const useDiscogs = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to GET data
    const getData = async (endpoint) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(endpoint);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error fetching data:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to PUT (update) data
    const updateData = async (endpoint, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(endpoint, data);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error updating data:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to POST data
    const postData = async (endpoint, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(endpoint, data);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error posting data:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to DELETE data
    const deleteData = async (endpoint) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.delete(endpoint);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error deleting data:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getData,
        updateData,
        postData,
        deleteData,
        loading,
        error,
    };
};