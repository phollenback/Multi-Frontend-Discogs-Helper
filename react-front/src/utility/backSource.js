import { useState } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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