exports.up = function(knex) {
  console.log("Creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.text("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("Dropping topics table...");
  return knex.schema.dropTable("topics");
};
