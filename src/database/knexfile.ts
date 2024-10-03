import { Knex } from 'knex'

const knexConfig: Record<'development' | 'test', Knex.Config> = {
    development: {
        client: 'postgresql',
        connection: {
            host: '127.0.0.1',
            database: 'uber',
            user: 'postgres',
            password: 'secret',
            port: 5432,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations/',
        },
    },
    test: {
        client: 'postgresql',
        connection: {
            host: '127.0.0.1',
            database: 'uber',
            user: 'postgres',
            password: 'secret',
            port: 5433,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations/',
        },
    },
}

export default knexConfig
