const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data/index");
const devData = require("./development-data/index");

const data = { test: testData, development: devData, production: devData };

module.exports = data[ENV];
