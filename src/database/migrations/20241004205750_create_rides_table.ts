import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('rides', (table) => {
        table.uuid('id').primary()
        table
            .uuid('rider_id')
            .references('id')
            .inTable('riders')
            .notNullable()
            .onDelete('CASCADE')
        table
            .uuid('driver_id')
            .references('id')
            .inTable('drivers')
            .nullable()
            .onDelete('SET NULL')
        table.string('origin').notNullable()
        table.string('destination').notNullable()
        table.decimal('distance', 10, 2).notNullable()
        table.decimal('price', 10, 2).notNullable()
        table
            .enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])
            .defaultTo('pending')
        table.boolean('is_uberx').defaultTo(false)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('rides')
}
