exports.up = knex => {
  return knex.schema.table('users', table => {
    table.boolean('emailsub').defaultTo(false);
  });
};

exports.down = knex => {
  return knex.schema.table('users', table => {
    table.dropColumn('emailsub');
  });
};