import { OkPacket } from "mysql";
import { execute } from '../services/mysql.connector';
import { User } from './users.model'
import { userQueries } from './users.queries'

export const readUsers = async ()  => {
    console.log('in readAlbums')
    return execute<User[]>(userQueries.readUsers, []);
};

export const createUser = async (user : User)  => {
    console.log('in create user')
    return execute<OkPacket>(userQueries.createUser, [user.username, user.email, user.password]);
};

export const readUserByUsername = async (username : string)  => {
    console.log('in read user by username')
    return execute<User[]>(userQueries.readUserByUsername, [username]);
};

export const updateUser = async (user : User, username : string)  => {
    console.log('in readAlbums')
    return execute<OkPacket>(userQueries.updateUser, [user.username, user.email, user.password, username]);
};

export const deleteUser = async (username : string)  => {
    console.log('in delete USER')
    console.log(userQueries.deleteUser)
    return execute<OkPacket>(userQueries.deleteUser, [username]);
};
