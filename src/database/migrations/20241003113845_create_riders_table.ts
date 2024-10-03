import { Knex } from 'knex'

exports.up = function (knex: Knex) {
    return knex.schema.createTable('riders', function (table) {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.decimal('balance').notNullable()
        table.date('birthday').notNullable()
    })
}

exports.down = function (knex: Knex) {
    return knex.schema.dropTable('riders')
}
