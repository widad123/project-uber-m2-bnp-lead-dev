import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
} from 'testcontainers'
import * as path from 'path'
import knex, { Knex } from 'knex'
import knexConfig from '../src/database/knexfile'

const composeFilePath = path.resolve(process.cwd(), 'test')
const composeFile = 'docker-compose-test.yaml'

export let dockerInstance: StartedDockerComposeEnvironment | null = null

export const startDockerPostgres = async () => {
    let sqlConnection: Knex

    try {
        console.log('start DB migration')
        dockerInstance = await new DockerComposeEnvironment(
            composeFilePath,
            composeFile
        ).up()
        sqlConnection = knex(knexConfig.test)
        await sqlConnection.migrate.latest()
        console.log('DB migration done')
    } catch (e) {
        console.log(e)
        throw new Error('Fail to start the database' + e)
    } finally {
        await sqlConnection!.destroy()
    }
}

const tables = ['users']

export const resetDB = async (sqlConnection: Knex) => {
    return Promise.all(
        tables.map((table) => sqlConnection.table(table).truncate())
    )
}
