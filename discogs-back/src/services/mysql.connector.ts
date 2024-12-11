import { createPool, Pool } from 'mysql'
let pool: Pool | null = null;

export const initializeMySqlConnector = () => {
    try
    {
        pool = createPool({
            connectionLimit:
                parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT != undefined ? process.env.MY_SQL_DB_CONNECTION_LIMIT : ""),
            port: 
                parseInt(process.env.MY_SQL_DB_PORT != undefined ? process.env.MY_SQL_DB_PORT : ""),
            host : process.env.MY_SQL_DB_HOST,
            user : process.env.MY_SQL_DB_USER,
            password : process.env.MY_SQL_DB_PASSWORD,
            database: process.env.MY_SQL_DB_DATABASE,
        });

        console.debug('Mysql Adapter Pool generated successsfully');
        console.log('process.env.DB_DATABASE', process.env.MY_SQL_DB_DATABASE);
        
        pool.getConnection((err: any, connection: any) => {
            if(err) {
                console.log('error mysql failed to connect');
                throw new Error('not able to connect to database');
            }
            else {
                console.log('connection made');
                connection.release();
            }
        })
    } catch (error) {
        console.error('[mysql.connector][initializeMySqlConnector][Error]: ', error);
        throw new Error('failed to initilize pool'); 
    }
}

export const execute = <T>(query: string, params: string[] | Object) : Promise<T> => {
    try {
        if(!pool) {
            initializeMySqlConnector();
        }
        
        return new Promise<T>((resolve, reject) => {
            pool!.query(query, params, (error: any, results: any) => {
                if(error){
                    
                    reject(error);
                } else {
                    
                    resolve(results);
                }
            });
        });

    } catch(error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('Failed to execute MySql query');
    }
}
