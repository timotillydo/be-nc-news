const connection = require("../db/connection");
const { selectArticles } = require("../models/articles-model");

exports.insertComment = (article_id, newComment) => {
  return connection("comments")
    .insert({
      author: newComment.username,
      article_id: article_id,
      body: newComment.body
    })
    .returning("*")
    .then(newComment => {
      return newComment[0];
    });
};

exports.selectAllCommentsByArticleId = (article_id, sort_by, order) => {
  if (order != undefined && order != "asc" && order != "desc") {
    return Promise.reject({
      status: 400,
      errMsg: `Error 400: Bad Request - Invalid Query`
    });
  }
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      return Promise.all([comments, selectArticles(article_id)]);
    })
    .then(([comments, article]) => {
      if (article) return comments;
      else
        return Promise.reject({
          status: 404,
          errMsg: "Error 404: Resource Not Found"
        });
    });
};

exports.removeCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount < 1)
        return Promise.reject({
          status: 404,
          errMsg: "Error 404: Resource Not Found"
        });
      else return deleteCount;
    });
};
