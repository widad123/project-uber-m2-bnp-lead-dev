import { dockerInstance } from './docker-manager'

const teardown = async () => {
    console.log('removing DB instance')
    try {
        await dockerInstance?.down()
        console.log('removed DB instance')
    } catch (e) {
        console.log('Failing to down the docker db instance', e)
    }
}

export default teardown
