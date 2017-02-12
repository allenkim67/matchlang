exports.up = knex => {
  return knex.schema.table('messages', table => table.string('tag', 1).defaultTo(null));
};

exports.down = knex => {
  return knex.schema.table('messages', table => table.dropColumn('tag'));
};