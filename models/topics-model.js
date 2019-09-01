const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection("topics")
    .select("*")
    .then(topics => {
      return topics;
    });
};

exports.insertTopic = newTopic => {
  return connection("topics")
    .insert(newTopic)
    .returning("*")
    .then(topic => topic);
};
