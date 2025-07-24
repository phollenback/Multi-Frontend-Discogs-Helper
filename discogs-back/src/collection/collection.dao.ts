import { OkPacket } from "mysql";
import { execute } from '../services/mysql.connector';
import { collectionQueries } from './collection.queries'
import { CollectionItem } from "./collection.model";

export const readCollection = async (userId : number)  => {
    console.log('in readAlbums')
    return execute<CollectionItem[]>(collectionQueries.readCollection, [userId]);
};

export const createCollectionItem = async (item : CollectionItem)  => {
    console.log('in create CI');
    return execute<OkPacket>(collectionQueries.createCollectionItem,
         [item.userId, item.discogsId, item.rating, item.notes, item.priceThreshold, item.wishlist]);
};

export const readCollectionItem = async (userId : number, discogsId : number)  => {
    console.log('in read CI');
    return execute<CollectionItem>(collectionQueries.readCollectionItem, [userId, discogsId]);
};

export const updateCollectionItem = async (item : CollectionItem, userId : number, discogsId : number)  => {
    console.log('in update CI');
    return execute<OkPacket>(collectionQueries.updateCollectionItem,
         [item.rating, item.notes, item.priceThreshold, item.wishlist, userId, discogsId]);
};

export const deleteCollectionItem = async (userId : number, discogsId : number)  => {
    console.log('in delete CI');
    return execute<OkPacket>(collectionQueries.deleteCollectionItem, [userId, discogsId]);
};

export const upsertCollectionItem = async (item : CollectionItem)  => {
    console.log('in upsert CI');
    return execute<OkPacket>(collectionQueries.upsertCollectionItem,
         [item.userId, item.discogsId, item.rating, item.notes, item.priceThreshold, item.wishlist]);
};