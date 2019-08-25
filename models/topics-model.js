const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection("topics")
    .select("*")
    .then(topics => {
      return topics;
    });
};
