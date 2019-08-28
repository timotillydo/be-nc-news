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
