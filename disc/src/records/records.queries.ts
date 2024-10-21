
export const recordQueries = {
    readRecords: `
     SELECT
        *
    FROM Discogs.records
    `,

    readRecordsByUser:`
        SELECT records.discogs_id,
	           records.title,
               records.artist,
               records.release_year,
               records.genre,
               records.styles
        FROM records
        JOIN user_records ON records.discogs_id = user_records.discogs_id
        WHERE user_records.user_id = ?
    `,

    createRecord:`
        INSERT INTO records VALUES (?,?,?,?,?,?)
    `,

    updateRecord:`
        UPDATE records
        SET title = ?,
            artist = ?,
            release_year = ?,
            genre = ?,
            styles = ?
        WHERE discogs_id = ?;
    `,

    deleteRecord:`
        DELETE FROM user_records 
        WHERE user_records.user_id = ? && 
        user_records.discogs_id = ?;
    `
}