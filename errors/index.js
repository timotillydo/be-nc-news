const { customErrorHandler } = require("./custom-errors");
const { psqlErrorHandler } = require("./psql-errors");

module.exports = { customErrorHandler, psqlErrorHandler };
