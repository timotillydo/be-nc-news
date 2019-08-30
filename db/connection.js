// const knex = require("knex");
// const config = require("../knexfile");

// const connection = knex(config);

// module.exports = connection;

const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

module.exports = knex(dbConfig);
