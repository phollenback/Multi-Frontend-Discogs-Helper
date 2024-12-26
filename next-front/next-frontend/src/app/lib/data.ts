import mysql from "mysql2/promise";

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10, // Adjust based on your app's concurrency needs
});

/**
 * A class for handling database queries and data fetching.
 */
export class Data {
  /**
   * Executes a raw SQL query with optional parameters.
   * @param query - The SQL query string.
   * @param params - Optional query parameters for prepared statements.
   * @returns A promise resolving to the query result.
   */
  static async query<T>(query: string, params: unknown[] = []): Promise<T[]> {
    try {
      const [rows] = await pool.query(query, params);
      return rows as T[];
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error("Failed to execute database query");
    }
  }

  /**
   * Fetches a single row by its ID.
   * @param tableName - The name of the database table.
   * @param id - The ID of the row to fetch.
   * @returns A promise resolving to the row data or `null` if not found.
   */
  static async findById<T>(tableName: string, id: number): Promise<T | null> {
    const query = `SELECT * FROM ?? WHERE id = ? LIMIT 1`;
    const rows = await this.query<T>(query, [tableName, id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Fetches all rows from a table.
   * @param tableName - The name of the database table.
   * @returns A promise resolving to an array of rows.
   */
  static async findAll<T>(tableName: string): Promise<T[]> {
    const query = `SELECT * FROM ??`;
    return this.query<T>(query, [tableName]);
  }

//   /**
//    * Inserts a new row into a table.
//    * @param tableName - The name of the database table.
//    * @param data - An object representing the data to insert.
//    * @returns A promise resolving to the inserted row's ID.
//    */
//   static async insert(tableName: string, data: Record<string, unknown>): Promise<number> {
//     const query = `INSERT INTO ?? SET ?`;
//     const result = await this.query<{ insertId: number }>(query, [tableName, data]);
//     return result.insertId;
//   }

//   /**
//    * Updates a row by its ID.
//    * @param tableName - The name of the database table.
//    * @param id - The ID of the row to update.
//    * @param data - An object representing the data to update.
//    * @returns A promise resolving to the number of affected rows.
//    */
//   static async update(tableName: string, id: number, data: Record<string, unknown>): Promise<number> {
//     const query = `UPDATE ?? SET ? WHERE id = ?`;
//     const result = await this.query<{ affectedRows: number }>(query, [tableName, data, id]);
//     return result.affectedRows;
//   }

//   /**
//    * Deletes a row by its ID.
//    * @param tableName - The name of the database table.
//    * @param id - The ID of the row to delete.
//    * @returns A promise resolving to the number of affected rows.
//    */
//   static async delete(tableName: string, id: number): Promise<number> {
//     const query = `DELETE FROM ?? WHERE id = ?`;
//     const result = await this.query<{ affectedRows: number }>(query, [tableName, id]);
//     return result.affectedRows;
//   }
}