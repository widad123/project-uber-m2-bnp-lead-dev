import type { Knex } from 'knex'

exports.up = function (knex: Knex) {
    return knex.schema.createTable('drivers', function (table) {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.boolean('available').defaultTo(true)
        table.float('rating').notNullable()
    })
}

exports.down = function (knex: Knex) {
    return knex.schema.dropTable('drivers')
}
