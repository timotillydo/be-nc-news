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

exports.selectAllCommentsByArticleId = (
  article_id,
  sort_by,
  order,
  limit,
  p
) => {
  if (order != undefined && order != "asc" && order != "desc") {
    return Promise.reject({
      status: 400,
      errMsg: `Error 400: Bad Request`
    });
  }
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(limit || 10)
    .modify(query => {
      if (!p) p = 1;
      const multiplier = limit || 10;
      const offsetVal = (p - 1) * multiplier;
      query.offset(offsetVal);
    })
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

exports.totalCommentCount = () => {
  return connection("comments")
    .select("*")
    .then(comments => {
      return comments.length;
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
