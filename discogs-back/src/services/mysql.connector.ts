import { createPool, Pool } from 'mysql'
let pool: Pool | null = null;

export const initializeMySqlConnector = () => {
    try
    {
        pool = createPool({
            connectionLimit: parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT || "10"),
            port: parseInt(process.env.MY_SQL_DB_PORT || "3306"),
            host: process.env.MY_SQL_DB_HOST || "127.0.0.1",
            user: process.env.MY_SQL_DB_USER || "root",
            password: process.env.MY_SQL_DB_PASSWORD || "",
            database: process.env.MY_SQL_DB_DATABASE || "Discogs",
        });

        console.debug('Mysql Adapter Pool generated successfully');
        console.log('process.env.DB_DATABASE', process.env.MY_SQL_DB_DATABASE);
        
        pool.getConnection((err: any, connection: any) => {
            if(err) {
                console.log('error mysql failed to connect:', err);
                throw new Error('not able to connect to database');
            }
            else {
                console.log('connection made');
                connection.release();
            }
        })
    } catch (error) {
        console.error('[mysql.connector][initializeMySqlConnector][Error]: ', error);
        throw new Error('failed to initialize pool'); 
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

export const checkDbConnection = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!pool) {
            initializeMySqlConnector();
        }
        pool!.getConnection((err, connection) => {
            if (err) {
                console.error('DB connection failed:', err);
                reject(false);
            } else {            
                console.log('DB connection successful');
                connection.release();
                resolve(true);
            }
        });
    });
}
