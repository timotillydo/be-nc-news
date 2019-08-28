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
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .modify(query => {
      if (sort_by) query.orderBy(sort_by, "desc");
      if (order) query.orderBy(sort_by || "created_at", order);
    })
    .then(comments => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          errMsg: "Error 404: Resource Not Found"
        });
      } else {
        // console.log(comments);
        return comments;
      }
    });
};
