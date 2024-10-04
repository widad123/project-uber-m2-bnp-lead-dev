import { Driver } from '../domain/models/Driver'

export interface DriverRepository {
    findAvailableDriver(): Promise<Driver | null>
}
