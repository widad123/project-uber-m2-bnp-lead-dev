import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
    await knex('riders').del()

    await knex('riders').insert([
        {
            id: uuidv4(),
            name: 'Alice Wonderland',
            balance: 100,
            birthday: '1990-05-15',
        },
        {
            id: uuidv4(),
            name: 'Bob Builder',
            balance: 200,
            birthday: '1985-10-20',
        },
        {
            id: uuidv4(),
            name: 'Charlie Chaplin',
            balance: 50,
            birthday: '1992-12-12',
        },
    ])
}
