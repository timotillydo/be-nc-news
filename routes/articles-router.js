const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = { articlesRouter };
