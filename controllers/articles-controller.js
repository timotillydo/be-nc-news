const { selectArticles, updateVotes } = require("../models/articles-model");
const {
  insertComment,
  selectAllCommentsByArticleId
} = require("../models/comments-model");

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, author, topic } = req.query;
  selectArticles(article_id, sort_by, order, author, topic)
    .then(articles => {
      if (Array.isArray(articles)) res.status(200).send({ articles });
      else res.status(200).send({ article: articles });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const data = req.body;
  updateVotes(article_id, comment_id, data)
    .then(updatedArticle => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(article_id, newComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectAllCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
