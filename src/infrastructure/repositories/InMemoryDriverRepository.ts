import { DriverRepository } from '../../core/gateways/DriverRepository'
import { Driver } from '../../core/domain/models/Driver'

export class InMemoryDriverRepository implements DriverRepository {
    private drivers: Driver[] = []

    async findAvailableDriver(): Promise<Driver | null> {
        return this.drivers.find((driver) => driver.is_available) || null
    }

    addDriver(driver: Driver): void {
        this.drivers.push(driver)
    }
}
