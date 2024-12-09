import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.discogs.com'
});

// Add token interceptor
api.interceptors.request.use(
    (config) => {
        const token = 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl';
        if (token) {
            // Add token to params
            config.params = {
                ...config.params, // Retain existing params, if any
                token: token      // Add the token as a query parameter
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getData = async (endpoint, data) => {
    try {
        const response = await api.get(endpoint, data); 
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};


export const updateData = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data); 
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export const postData = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data); 
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export const deleteData = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data); 
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}