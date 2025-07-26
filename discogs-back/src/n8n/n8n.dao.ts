import { OkPacket } from "mysql";
import { execute } from '../services/mysql.connector';
import { n8nQueries } from './n8n.queries';

export const syncWantlist = async ()  => {
    console.log('in readUsers')
    return execute<OkPacket>(n8nQueries.syncWantlist, []);
};

export const syncCollection = async ()  => {
    console.log('in syncCollection')
    return execute<OkPacket>(n8nQueries.syncCollection, []);
}