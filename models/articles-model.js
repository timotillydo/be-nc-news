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
      return article[0];
    });
};

exports.updateArticleById = (article_id, data) => {
  const newVotes = data.inc_votes;
  if (!newVotes) {
    return Promise.reject({ status: 400, errMsg: "Error 400: Malformed Body" });
  } else {
    return connection("articles")
      .where("article_id", "=", article_id)
      .increment("votes", newVotes)
      .returning("*")
      .then(article => {
        if (!article.length) {
          return Promise.reject({
            status: 404,
            errMsg: `Error 404: Article_id ${article_id} Not Found`
          });
        }
        return article[0];
      });
    // .catch(err => console.log(err));
  }
};
