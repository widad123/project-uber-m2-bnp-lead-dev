import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
    await knex('drivers').del()

    await knex('drivers').insert([
        { id: uuidv4(), name: 'John Doe', is_available: true },
        { id: uuidv4(), name: 'Jane Smith', is_available: true },
        { id: uuidv4(), name: 'Foo Bar', is_available: true },
    ])
}
