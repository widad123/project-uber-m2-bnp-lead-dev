import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('riders', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.decimal('balance', 10, 2).notNullable()
        table.date('birthday').notNullable()
        table.boolean('is_first_ride').defaultTo(true)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('riders')
}
