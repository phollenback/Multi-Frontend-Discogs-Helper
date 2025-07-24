import { deleteCollectionItem, updateCollectionItem } from "./collection.dao";

export const collectionQueries = {
    readCollection: `
    SELECT
        ur.user_id,
        r.discogs_id,
        r.title,
        r.artist,
        r.release_year,
        r.genre,
        r.styles,
        ur.notes,
        ur.price_threshold,
        ur.rating,
        ur.wishlist
    FROM user_records ur
    JOIN records r ON ur.discogs_id = r.discogs_id
    WHERE ur.user_id = ?
    `,

    readCollectionItem:`
    SELECT
        ur.user_id,
        r.discogs_id,
        r.title,
        r.artist,
        r.release_year,
        r.genre,
        r.styles,
        ur.notes,
        ur.price_threshold,
        ur.rating,
        ur.wishlist
    FROM user_records ur
    JOIN records r ON ur.discogs_id = r.discogs_id
    WHERE ur.user_id = ? && ur.discogs_id = ?
    `,

    createCollectionItem:`
    INSERT INTO user_records (user_id, discogs_id, rating, notes, price_threshold, wishlist)
    VALUES (?,?,?,?,?,?) 
    `,

    updateCollectionItem:`
    UPDATE user_records
    SET rating = ?, notes = ?, price_threshold = ?, wishlist = ?
    WHERE user_id = ? && discogs_id = ?;
    `,

    deleteCollectionItem:`
    DELETE FROM user_records WHERE user_id = ? && discogs_id = ?
    `,

    upsertCollectionItem: `
    INSERT INTO user_records (user_id, discogs_id, rating, notes, price_threshold, wishlist)
    VALUES (?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      rating = VALUES(rating),
      notes = VALUES(notes),
      price_threshold = VALUES(price_threshold),
      wishlist = VALUES(wishlist);
    `
}