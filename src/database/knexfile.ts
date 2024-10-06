import dotenv from 'dotenv'
import { Knex } from 'knex'

dotenv.config()

const knexConfig: Record<'development' | 'test', Knex.Config> = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'widad',
            database: 'uber',
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
        seeds: {
            directory: __dirname + '/seeds',
        },
    },
    test: {
        client: 'postgresql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: String(process.env.DB_PASSWORD),
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 5432,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations/',
        },
        seeds: {
            directory: __dirname + '/seeds',
        },
    },
}

export default knexConfig
