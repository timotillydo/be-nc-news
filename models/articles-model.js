const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id") // condensing all the multiple entries from comments with the same article id into the comment_count
    .then(article => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          errMsg: `Error 404: Article_id ${article_id} Not Found`
        });
      }
      return article;
    });
  // .catch(err => console.log(err));
};
