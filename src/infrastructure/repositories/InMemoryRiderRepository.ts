import { RiderRepository } from '../../core/gateways/RiderRepository'
import { Rider } from '../../core/domain/models/Rider'

export class InMemoryRiderRepository implements RiderRepository {
    private riders: Rider[] = []

    async findById(rider_id: string): Promise<Rider | null> {
        return this.riders.find((rider) => rider.id === rider_id) || null
    }

    addRider(rider: Rider): void {
        this.riders.push(rider)
    }
}
