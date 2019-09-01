const {
  selectArticles,
  updateVotes,
  getTotalArticleCount,
  insertArticle
} = require("../models/articles-model");
const {
  insertComment,
  selectAllCommentsByArticleId,
  getTotalCommentCount
} = require("../models/comments-model");

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, author, topic, limit, p } = req.query;
  selectArticles(article_id, sort_by, order, author, topic, limit, p)
    .then(articles => {
      return Promise.all([articles, getTotalArticleCount(author, topic)]);
    })
    .then(([articles, total_count]) => {
      if (Array.isArray(articles))
        res.status(200).send({ articles, total_count });
      else res.status(200).send({ article: articles });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, limit, p } = req.query;
  selectAllCommentsByArticleId(article_id, sort_by, order, limit, p)
    .then(comments => {
      return Promise.all([comments, getTotalCommentCount()]);
    })
    .then(([comments, total_count]) => {
      res.status(200).send({ comments, total_count });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(article_id, comment_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
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

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then(([article]) => res.status(201).send({ article }))
    .catch(next);
};
