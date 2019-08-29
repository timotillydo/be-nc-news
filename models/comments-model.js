const connection = require("../db/connection");

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
  // .catch(err => console.log(err));
};

exports.selectAllCommentsByArticleId = (article_id, sort_by, order) => {
  if (order === undefined || order === "asc" || order === "desc") {
    return connection("comments")
      .select("*")
      .where("article_id", article_id)
      .orderBy(sort_by || "created_at", order || "desc")
      .then(comments => {
        if (!comments.length) {
          return Promise.reject({
            status: 422,
            errMsg: "Error 422: Unprocessable Entity"
          });
        } else {
          return comments;
        }
      });
    // .catch(err => console.log(err));
  } else {
    return Promise.reject({
      status: 400,
      errMsg: "Error 400: Bad Request - Invalid Query"
    });
  }
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
