const { updateVotes } = require("../models/articles-model");

exports.patchCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const data = req.body;
  updateVotes(article_id, comment_id, data)
    .then(updatedComment => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
