import { startDockerPostgres } from './docker-manager'
import teardown from './teardown-integration'

const setup = async () => {
    try {
        await startDockerPostgres()
    } catch (e) {
        console.error('Error setting up integration tests', e)
        await teardown()
    }
}

export default setup
