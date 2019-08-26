const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection("comments")
    .select("*")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id", "asc")
    .then(article => console.log(article));
};

// select * from articles left join comments on articles.article_id = comments.article_id where articles.article_id = 1 order by articles.article_id asc;
