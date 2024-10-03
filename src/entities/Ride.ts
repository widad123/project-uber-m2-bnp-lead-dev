import { Rider } from './Rider'
import { Driver } from './Driver'

export class Ride {
    rider: Rider
    driver: Driver | null
    destination: string
    distance: number
    price: number
    isCanceled: boolean
    date: Date

    constructor(
        rider: Rider,
        destination: string,
        distance: number,
        date: Date = new Date()
    ) {
        this.rider = rider
        this.destination = destination
        this.driver = null
        this.distance = distance
        this.price = 0
        this.isCanceled = false
        this.date = date
    }

    assignDriver(driver: Driver) {
        this.driver = driver
    }

    isConfirmed(): boolean {
        return this.driver !== null
    }

    cancel(): string {
        if (this.isCanceled) {
            throw new Error('Reservation is already canceled.')
        }

        const today = new Date()
        const isBirthday =
            today.getDate() === this.rider.birthday.getDate() &&
            today.getMonth() === this.rider.birthday.getMonth()

        if (isBirthday) {
            this.isCanceled = true
            return "Cancellation is free because it's your birthday!"
        }

        if (this.driver && this.driver.isOnTheWay) {
            this.rider.balance -= 5
        }

        this.isCanceled = true
        return 'Reservation canceled.'
    }
}
