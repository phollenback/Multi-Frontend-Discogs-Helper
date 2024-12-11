
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
    `
}