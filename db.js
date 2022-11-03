const dbUrl =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/imageboard";
const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

module.exports.getImages = () => {
    // only returns rows from table where "signatures" has a row with a user id which is equal to a row in the users table with that same id
    // order by created_at desc means the most recently created image will be first
    return db

        .query(
            `SELECT * ,(
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
            ) AS "lowestId"
            FROM images
            ORDER BY created_at DESC
            LIMIT 8`
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.getMoreImages = (lastId) =>
    db
        .query(
            `SELECT *,(
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
            ) AS "lowestId"
            FROM images
            WHERE id < $1
            ORDER BY id DESC
             LIMIT 8`,
            [lastId]
        )
        // with deconstruction, instead of "then((result) => { return result.rows;})", we can write it like so (this also returns the value without me having to write "return")

        .then(({ rows }) => rows);

module.exports.insertImage = (url, title, description, username) => {
    return db
        .query(
            `Insert INTO images (url, title, description,username)
         VALUES($1,$2,$3,$4)
         RETURNING *`,
            [url, title, description, username]
        )
        .then((result) => {
            return result.rows[0];
        });
};

module.exports.deleteImage = (id) => {
    return db.query(`DELETE FROM images WHERE id=$1 `, [id]);
};

module.exports.getComments = (image_id) => {
    return db
        .query(
            `SELECT * FROM comments WHERE image_id=$1  ORDER BY created_at DESC
    `,
            [image_id]
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.insertComment = (comment, username, image_id) => {
    return db
        .query(
            `INSERT INTO comments(comment,username, image_id)
        VALUES($1,$2,$3)
        RETURNING *`,
            [comment, username, image_id]
        )
        .then((result) => {
            return result.rows[0];
        });
};
