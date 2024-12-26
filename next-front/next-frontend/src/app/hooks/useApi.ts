import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Define types for API responses and errors (you can adjust these based on your API)
interface ApiError {
  message: string;
  statusCode?: number;
}

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Function to handle POST requests
  const postData = async <T>(endpoint: string, data: T): Promise<T> => {
    setLoading(true);
    setError(null);
  
    try {
      const response: AxiosResponse<T> = await api.post(endpoint, data); // Axios response with type T
      return response.data; // The response will also be of type T
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError?.response?.data || { message: "Error posting data" });
      console.error("Error posting data:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle GET requests
  const getData = async <T>(endpoint: string): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await api.get(endpoint);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError?.response?.data || { message: "Error fetching data" });
      console.error("Error fetching data:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle PUT requests
  const updateData = async <T>(endpoint: string, data: T): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await api.put(endpoint, data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError?.response?.data || { message: "Error updating data" });
      console.error("Error updating data:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle DELETE requests
  const deleteData = async <T>(endpoint: string): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await api.delete(endpoint);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError?.response?.data || { message: "Error deleting data" });
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