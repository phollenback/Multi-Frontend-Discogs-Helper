import { createPool, Pool } from 'mysql'
let pool: Pool | null = null;

export const initializeMySqlConnector = () => {
    try
    {
        pool = createPool({
            connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 10,
            port: process.env.MY_SQL_DB_PORT ? parseInt(process.env.MY_SQL_DB_PORT) : 3306,
            host : process.env.MY_SQL_DB_HOST,
            user : process.env.MY_SQL_DB_USER,
            password : process.env.MY_SQL_DB_PASSWORD,
            database: process.env.MY_SQL_DB_DATABASE,
        });

        console.debug('Mysql Adapter Pool generated successsfully');
        console.log('MY_SQL_DB_DATABASE:', process.env.MY_SQL_DB_DATABASE);
        console.log('MY_SQL_DB_USER:', process.env.MY_SQL_DB_USER);
        console.log('MY_SQL_DB_PASSWORD:', process.env.MY_SQL_DB_PASSWORD);
        console.log('MY_SQL_DB_HOST:', process.env.MY_SQL_DB_HOST);
        console.log('MY_SQL_DB_PORT:', process.env.MY_SQL_DB_PORT);
        console.log('MY_SQL_DB_CONNECTION_LIMIT:', process.env.MY_SQL_DB_CONNECTION_LIMIT);

        
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

// Function to close the pool (useful for tests)
export const closePool = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (pool) {
            pool.end((err) => {
                if (err) {
                    console.error('[mysql.connector][closePool][Error]: ', err);
                    reject(err);
                } else {
                    console.log('[mysql.connector][closePool] Pool closed successfully');
                    pool = null;
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}
