exports.up = knex => {
  return knex.schema.createTable('devices', table => {
    table.increments('id').primary();
    table.string('token').notNullable();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.index(['user_id', 'token']);
  });
};

exports.down = knex => {
  return knex.schema.dropTable('devices');
};
