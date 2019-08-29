const connection = require("../db/connection");
const { selectTopics } = require("../models/topics-model");

exports.selectArticles = (article_id, sort_by, order, author, topic) => {
  if (order != undefined && order != "asc" && order != "desc") {
    return Promise.reject({
      status: 400,
      errMsg: `Error 400: Bad Request - Invalid Query`
    });
  }
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (article_id) {
        query.where("articles.article_id", "=", article_id);
      } else if (author) {
        query.where("articles.author", "=", author);
      } else if (topic) {
        query.where("articles.topic", "=", topic);
      }
    })
    .groupBy("articles.article_id")
    .then(articles => {
      return Promise.all([articles, selectTopics()]);
    })
    .then(([articles, topics]) => {
      if (articles.length === 1) return articles[0];
      if (articles.length) return articles;
      if (topics[topic]) return articles;
      else
        return Promise.reject({
          status: 404,
          errMsg: `Error 404: Resource Not Found`
        });
    });
};

exports.updateVotes = (article_id, comment_id, inc_votes) => {
  return connection
    .select("*")
    .modify(query => {
      if (!article_id) {
        query.from("comments").where("comments.comment_id", "=", comment_id);
      } else {
        query.from("articles").where("articles.article_id", "=", article_id);
      }
    })
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(response => {
      if (!response.length) {
        return Promise.reject({
          status: 404,
          errMsg: `Error 404: Resource Not Found`
        });
      }
      return response;
    });
};
