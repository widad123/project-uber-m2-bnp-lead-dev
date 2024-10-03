import type { Knex } from 'knex'

exports.up = function (knex: Knex) {
    return knex.schema.createTable('drivers', function (table) {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.boolean('available').defaultTo(true)
        table.boolean('is_on_the_way')
    })
}

exports.down = function (knex: Knex) {
    return knex.schema.dropTable('drivers')
}
