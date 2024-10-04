import { UuidGenerator } from './UuidGenerator'
import { v4 as uuidv4 } from 'uuid'

export class UuidGeneratorImpl implements UuidGenerator {
    generate(): string {
        return uuidv4()
    }
}
