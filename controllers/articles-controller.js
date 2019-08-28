const {
  selectArticles,
  updateArticleById
} = require("../models/articles-model");
const {
  insertComment,
  selectAllCommentsByArticleId
} = require("../models/comments-model");

//Reusing controller and model if no id passed then just get all articles
exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectArticles(article_id, sort_by, order)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;
  updateArticleById(article_id, data)
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
