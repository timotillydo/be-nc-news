const { updateVotes } = require("../models/articles-model");
const { removeCommentById } = require("../models/comments-model");

exports.patchCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(article_id, comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
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
