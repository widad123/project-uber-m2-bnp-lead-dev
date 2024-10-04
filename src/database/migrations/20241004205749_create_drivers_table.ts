import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('drivers', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.boolean('is_available').defaultTo(true)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('drivers')
}
