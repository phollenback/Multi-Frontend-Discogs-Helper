import { useState } from "react";
import axios from "axios";

// Create the Axios instance with base URL for Discogs API
const api = axios.create({
    baseURL: 'https://api.discogs.com'
});

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Rate limiting function
const rateLimit = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        console.log(`Rate limiting: waiting ${delay}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    lastRequestTime = Date.now();
};

// Add token interceptor
api.interceptors.request.use(
    async (config) => {
        // Apply rate limiting before each request
        await rateLimit();
        
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

    // Function to handle rate limit errors
    const handleRateLimitError = async (error, retryCount = 0) => {
        if (error.response?.status === 429 && retryCount < 3) {
            const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Rate limited. Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return true; // Indicate retry should happen
        }
        return false; // Don't retry
    };

    // Function to GET data
    const getData = async (endpoint) => {
        setLoading(true);
        setError(null);
        let retryCount = 0;
        
        while (retryCount < 3) {
            try {
                const response = await api.get(endpoint);
                return response.data;
            } catch (err) {
                const shouldRetry = await handleRateLimitError(err, retryCount);
                if (shouldRetry) {
                    retryCount++;
                    continue;
                }
                setError(err);
                console.error("Error fetching data:", err);
                throw err;
            }
        }
        setLoading(false);
    };

    // Function to PUT (update) data
    const putData = async (endpoint, data = {}) => {
        setLoading(true);
        setError(null);
        let retryCount = 0;
        
        while (retryCount < 3) {
            try {
                const response = await api.put(endpoint, data);
                return response.data;
            } catch (err) {
                const shouldRetry = await handleRateLimitError(err, retryCount);
                if (shouldRetry) {
                    retryCount++;
                    continue;
                }
                setError(err);
                console.error("Error updating data:", err);
                throw err;
            }
        }
        setLoading(false);
    };

    // Function to POST data
    const postData = async (endpoint, data) => {
        setLoading(true);
        setError(null);
        let retryCount = 0;
        
        while (retryCount < 3) {
            try {
                const response = await api.post(endpoint, data);
                return response.data;
            } catch (err) {
                const shouldRetry = await handleRateLimitError(err, retryCount);
                if (shouldRetry) {
                    retryCount++;
                    continue;
                }
                setError(err);
                console.error("Error posting data:", err);
                throw err;
            }
        }
        setLoading(false);
    };

    // Function to DELETE data
    const deleteData = async (endpoint) => {
        setLoading(true);
        setError(null);
        let retryCount = 0;
        
        while (retryCount < 3) {
            try {
                const response = await api.delete(endpoint);
                return response.data;
            } catch (err) {
                const shouldRetry = await handleRateLimitError(err, retryCount);
                if (shouldRetry) {
                    retryCount++;
                    continue;
                }
                setError(err);
                console.error("Error deleting data:", err);
                throw err;
            }
        }
        setLoading(false);
    };

    return {
        getData,
        postData,
        deleteData,
        putData,
        loading,
        error,
    };
};