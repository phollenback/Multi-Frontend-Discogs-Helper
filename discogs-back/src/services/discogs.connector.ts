import axios from 'axios';
import requests from '../helpers/suggestions.requests'; 

export const suggestionRequest = async (genre: string, style: string) => {
    try {
        const response = await axios.get(requests.readSuggestion, {
            params: {
                type : 'release',
                genre: genre,
                style: style,
                token: 'sgSOwNnDMKJCOWpLLTdNccwHTAbGVrUZOXjLcqxl'
            },
        });

        // Map the response to extract only title, cover_image, and year
        const extractedData = response.data.results.map((result: any) => ({
            title: result.title,
            cover_image: result.cover_image,
            year: result.year,
        }));

        // return array of suggestion items
        return extractedData;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch suggestions');
    }
};