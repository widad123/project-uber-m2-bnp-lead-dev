import { Rider } from '../domain/models/Rider'

export class PriceCalculator {
    constructor(
        private baseFare: number = 2,
        private pricePerKm: number = 0.5,
        private uberXSupplement: number = 5,
        private christmasMultiplier: number = 2,
        private welcomeOffer: number = 20
    ) {}

    calculatePrice(
        rider: Rider,
        origin: string,
        destination: string,
        distance: number,
        is_uberx: boolean,
        isChristmas: boolean
    ): number {
        const basePrice = this.getBasePrice(origin, destination)

        let totalPrice = basePrice + this.pricePerKm * distance

        if (is_uberx && !this.isRiderBirthday(rider)) {
            totalPrice += this.uberXSupplement
        }

        if (isChristmas) {
            totalPrice *= this.christmasMultiplier
        }

        if (this.isRiderBirthday(rider)) {
            totalPrice = Math.max(totalPrice - this.uberXSupplement, 0)
        }

        if (rider.isFirstRide && totalPrice > this.welcomeOffer) {
            totalPrice = Math.max(totalPrice - this.welcomeOffer, 0)
        }

        return Math.max(totalPrice, 0)
    }

    private getBasePrice(origin: string, destination: string): number {
        if (origin === 'Paris' && destination === 'Paris') {
            return 2
        } else if (origin !== 'Paris' && destination === 'Paris') {
            return 0
        } else if (origin === 'Paris' && destination !== 'Paris') {
            return 10
        }
        return 2
    }

    private isRiderBirthday(rider: Rider): boolean {
        const today = new Date()
        return (
            rider.birthday.getDate() === today.getDate() &&
            rider.birthday.getMonth() === today.getMonth()
        )
    }
}
