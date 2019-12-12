var spicedPg = require("spiced-pg");
var database = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/fifthdimensiondatabase"
);

///insert image to database
module.exports.upload = function(image) {
    return database.query(
        `INSERT INTO imageContent (url) VALUES ($1) RETURNING *`,
        [image]
    );
};
module.exports.getImages = function() {
    return database.query(`SELECT * FROM imageContent`);
};
