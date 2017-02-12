exports.up = knex => {
  return knex.schema.table('users', table => {
    table.datetime('created').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.table('users', table => {
    table.dropColumn('created');
  });
};