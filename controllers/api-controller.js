const ncnewsapi = require("../endpoints.json");

exports.getApiEndpoints = (req, res, next) => {
  res.status(200).send({ ncnewsapi });
};
