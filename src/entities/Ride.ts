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

    calculatePrice(
        isUberX: boolean,
        isChristmas: boolean,
        isWelcomeOffer: boolean
    ): number {
        const basePrice = this.getBasePrice()
        const kmPrice = this.distance * 0.5
        let totalPrice = basePrice + kmPrice

        if (isUberX && !this.isRiderBirthday()) {
            totalPrice += 5
        }

        if (isChristmas) {
            totalPrice *= 2
        }

        if (isWelcomeOffer) {
            totalPrice -= 20
        }

        return totalPrice > 0 ? totalPrice : 0
    }

    private getBasePrice(): number {
        if (this.destination === 'Paris') {
            return this.rider.activeReservation ? 2 : 10
        }
        return 0
    }

    private isRiderBirthday(): boolean {
        const today = new Date()
        return (
            today.getDate() === this.rider.birthday.getDate() &&
            today.getMonth() === this.rider.birthday.getMonth()
        )
    }

    cancel(): string {
        if (this.isCanceled) {
            throw new Error('Reservation is already canceled.')
        }

        if (this.isRiderBirthday()) {
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
