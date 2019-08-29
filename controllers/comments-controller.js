const { updateVotes } = require("../models/articles-model");
const { removeCommentById } = require("../models/comments-model");

exports.patchCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const data = req.body;
  updateVotes(article_id, comment_id, data)
    .then(updatedComment => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(deletCount => {
      res.status(204).send();
    })
    .catch(next);
};
