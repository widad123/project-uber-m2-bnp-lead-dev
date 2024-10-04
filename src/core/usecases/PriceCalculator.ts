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
        isUberX: boolean,
        isChristmas: boolean
    ): number {
        const basePrice = this.getBasePrice(origin, destination)
        console.log('Base price:', basePrice)

        let totalPrice = basePrice + this.pricePerKm * distance
        console.log('Total price after distance:', totalPrice)

        if (isUberX && !this.isRiderBirthday(rider)) {
            totalPrice += this.uberXSupplement
            console.log('Total price after UberX supplement:', totalPrice)
        }

        if (isChristmas) {
            totalPrice *= this.christmasMultiplier
            console.log('Total price after Christmas multiplier:', totalPrice)
        }

        if (this.isRiderBirthday(rider)) {
            totalPrice = Math.max(totalPrice - this.uberXSupplement, 0)
            console.log('Total price after birthday offer:', totalPrice)
        }

        if (rider.isFirstRide && totalPrice > this.welcomeOffer) {
            totalPrice = Math.max(totalPrice - this.welcomeOffer, 0)
            console.log('Total price after welcome offer:', totalPrice)
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
