import { Rider } from '../domain/models/Rider'

export interface RiderRepository {
    findById(rider_id: string): Promise<Rider | null>
}
