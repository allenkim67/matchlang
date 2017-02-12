exports.up = knex => {
  return knex.schema.table('group_convos', table => {
    table.string('description');
    table.datetime('start').defaultTo(null);
    table.integer('limit').defaultTo(null);
  });
};

exports.down = knex => {
  return knex.schema.table('group_convos', table => {
    table.dropColumn('description');
    table.dropColumn('start');
    table.dropColumn('limit');
  });
};