import { Ride } from './Ride'

export interface Rider {
    id: string
    name: string
    balance: number
    birthday: Date
    activeReservation: Ride | null
}
