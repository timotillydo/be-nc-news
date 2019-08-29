const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  console.log("       Runnning seed file...");
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      console.log("       Migrate-rollback/latest Complete");
    })
    .then(() => Promise.all([topicsInsertions, usersInsertions]))
    .then(() => {
      return knex("articles")
        .insert(formatDates(articleData))
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
