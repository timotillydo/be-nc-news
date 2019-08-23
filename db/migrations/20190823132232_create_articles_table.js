exports.up = function(knex) {
  console.log("Creating articles table...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable
      .increments("article_id")
      .primary()
      .notNullable();
    articlesTable.string("title").notNullable();
    articlesTable.string("body").notNullable();
    articlesTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    articlesTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articlesTable
      .string("author")
      .references("users.username")
      .notNullable();
    articlesTable.timestamp("created_at");
  });
};

exports.down = function(knex) {
  console.log("Dropping articles table...");
  return knex.schema.dropTable("articles");
};

// - `article_id` which is the primary key
// - `title`
// - `body`
// - `votes` defaults to 0
// - `topic` field which references the slug in the articles table
// - `author` field that references a user's primary key (username)
// - `created_at` defaults to the current timestamp
