
export const userQueries = {
    readUsers: `
     SELECT
        *
    FROM Discogs.users
    `,

    createUser:`
    INSERT INTO users (username, email, password)
    VALUES (?,?,?)
    `,

    readUserByUsername:`
    SELECT
        users.username,
        users.password,
        users.email
    FROM users
    WHERE users.username = ?
    `,

    updateUser:`
    UPDATE users
    SET username = ?, email = ?, password = ?
    WHERE username = ?
    `,

    deleteUser:`
    DELETE FROM Discogs.users WHERE username = ?
    `,

    readWantlist:`
    SELECT 
        ur.user_id,
        ur.discogs_id,
        ur.notes,
        ur.price_threshold,
        ur.rating,
        ur.wishlist,
        r.title,
        r.artist,
        r.release_year,
        r.genre,
        r.styles,
        r.thumb_url,
        r.cover_image_url
    FROM user_records ur
    JOIN records r ON ur.discogs_id = r.discogs_id
    WHERE ur.user_id = ? AND ur.wishlist = 1
    `
}