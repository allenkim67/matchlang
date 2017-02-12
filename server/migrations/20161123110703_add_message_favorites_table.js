exports.up = knex => {
  return knex.schema.createTable('favorites', table => {
    table.increments('id').primary();
    table.integer('message_id').notNullable().references('id').inTable('messages');
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.index('user_id');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('favorites');
};
