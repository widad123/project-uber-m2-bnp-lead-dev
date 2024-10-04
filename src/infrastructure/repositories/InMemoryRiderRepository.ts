import { RiderRepository } from '../../core/gateways/RiderRepository'
import { Rider } from '../../core/domain/models/Rider'

export class InMemoryRiderRepository implements RiderRepository {
    private riders: Rider[] = []

    async findById(riderId: string): Promise<Rider | null> {
        return this.riders.find((rider) => rider.id === riderId) || null
    }

    addRider(rider: Rider): void {
        this.riders.push(rider)
    }
}
