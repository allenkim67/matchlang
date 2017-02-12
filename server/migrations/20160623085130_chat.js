exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('email').notNullable();
      table.string('location');
      table.text('description');
      table.date('birthdate');
      table.integer('price').notNullable().defaultTo(0);
      table.datetime('last_active').notNullable().defaultTo(knex.fn.now());
      table.boolean('teacher').notNullable().defaultTo(false);
      table.integer('credits').notNullable().defaultTo(0);
      table.index('last_active');
    }),

    knex.schema.createTable('group_convos', function(table) {
      table.increments('id').primary();
      table.integer('price').notNullable().defaultTo(0);
      table.string('name').notNullable();
    }),

    knex.schema.createTable('group_users', function(table) {
      table.increments('id').primary();
      table.integer('group_convo_id').notNullable().references('id').inTable('group_convos');
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('unread').notNullable().defaultTo(0);
      table.boolean('admin').notNullable().defaultTo(false);
    }),

    knex.schema.createTable('messages', function(table) {
      table.increments('id').primary();
      table.text('content').notNullable();
      table.integer('convo_id').notNullable();
      table.integer('parent_id').references('id').inTable('messages').defaultTo(null);
      table.integer('sender_id').notNullable().references('id').inTable('users');
      table.datetime('sent_at').notNullable().defaultTo(knex.fn.now());
      table.string('convo_type', 7).defaultTo('private');
      table.index('sent_at');
    }),

    knex.schema.createTable('convos', function(table) {
      table.increments('id').primary();
      table.integer('teacher_id').notNullable().references('id').inTable('users');
      table.integer('student_id').notNullable().references('id').inTable('users');
      table.integer('teacher_unread').notNullable().defaultTo(0);
      table.integer('student_unread').notNullable().defaultTo(0);
      table.integer('price').notNullable();
      table.unique(['teacher_id', 'student_id']);
      table.index(['teacher_id', 'student_id']);
    }),

    knex.schema.createTable('learning_langs', function(table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.string('lang').notNullable();
      table.integer('level').notNullable().defaultTo(0);
      table.index('user_id');
    }),

    knex.schema.createTable('speaking_langs', function(table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.string('lang').notNullable();
      table.index('user_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('learning_langs'),
    knex.schema.dropTable('speaking_langs'),
    knex.schema.dropTable('messages'),
    knex.schema.dropTable('convos'),
    knex.schema.dropTable('group_users'),
    knex.schema.dropTable('group_convos'),
    knex.schema.dropTable('users')
  ]);
};