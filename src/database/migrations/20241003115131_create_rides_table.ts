import type { Knex } from 'knex'

exports.up = function (knex: Knex) {
    return knex.schema.createTable('rides', function (table) {
        table.uuid('id').primary()
        table
            .uuid('rider_id')
            .references('id')
            .inTable('riders')
            .onDelete('CASCADE')
        table
            .uuid('driver_id')
            .references('id')
            .inTable('drivers')
            .onDelete('CASCADE')
        table.string('destination').notNullable()
        table.decimal('price').notNullable()
        table.float('distance').notNullable()
        table.timestamp('date').defaultTo(knex.fn.now())
    })
}

exports.down = function (knex: Knex) {
    return knex.schema.dropTable('rides')
}
