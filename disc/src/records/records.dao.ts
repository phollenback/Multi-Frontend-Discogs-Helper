import { OkPacket } from "mysql";
import { execute } from '../services/mysql.connector';
import { Record } from './records.model'
import { recordQueries } from './records.queries'

export const readRecords = async ()  => {
    console.log('in readAlbums')
    return execute<Record[]>(recordQueries.readRecords, []);
};

export const readRecordsById = async (userId : number) => {
    console.log('in read by id. ID: ' + userId);
    return execute<Record[]>(recordQueries.readRecordsByUser, [userId]);
}

export const deleteRecord = async (userId : number, discogsId : number) => {
    console.log('in delete record. discogs ID: ' + discogsId)
    return execute<Record[]>(recordQueries.deleteRecord, [userId, discogsId])
}

export const createRecord = async (record : Record) => {
    console.log('in create record.');
   
    return execute<OkPacket>(recordQueries.createRecord, 
            [record.discogsId, record.title, record.artist, record.releaseYear, record.genre, record.styles])
}

export const updateRecord = async (record : Record) => {
    console.log('in create record.');
   
    return execute<OkPacket>(recordQueries.updateRecord, 
            [record.title, record.artist, record.releaseYear, record.genre, record.styles, record.discogsId])
}