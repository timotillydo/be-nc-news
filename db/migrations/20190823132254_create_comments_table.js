exports.up = function(knex) {
  console.log("Creating comments table...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable
      .increments("comment_id")
      .primary()
      .notNullable();
    commentsTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentsTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("Dropping comments table...");
  return knex.schema.dropTable("comments");
};

// - `comment_id` which is the primary key
// - `author` field that references a user's primary key (username)
// - `article_id` field that references an article's primary key
// - `votes` defaults to 0
// - `created_at` defaults to the current timestamp
// - `body`
