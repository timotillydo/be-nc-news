const articlesRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const {
  getArticles,
  patchArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId
} = require("../controllers/articles-controller");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id")
  .get(getArticles)
  .patch(patchArticleById)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(invalidMethodHandler);

module.exports = { articlesRouter };
