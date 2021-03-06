const articlesRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const {
  getArticles,
  patchArticleById,
  postArticle,
  postCommentByArticleId,
  getAllCommentsByArticleId,
  deleteArticleById
} = require("../controllers/articles-controller");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id")
  .get(getArticles)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(invalidMethodHandler);

module.exports = { articlesRouter };
