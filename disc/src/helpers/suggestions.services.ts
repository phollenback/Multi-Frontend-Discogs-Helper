import { readCollection } from "../collection/collection.dao";
import { suggestionRequest } from "../services/discogs.connector";
import { CollectionItem } from "../collection/collection.model";

export const readSuggestions = (userId : number) => {
    let suggestions;
    // query discogs api
    suggestions = suggestionRequest("rock", "grunge");

    return suggestions;
}