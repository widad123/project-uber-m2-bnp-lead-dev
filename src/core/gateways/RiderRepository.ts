import { Rider } from '../domain/models/Rider'

export interface RiderRepository {
    findById(riderId: string): Promise<Rider | null>
}
