export interface Rider {
    id: string
    name: string
    balance: number
    birthday: Date
    activeReservation: Reservation | null
}

export interface Driver {
    id: string
    name: string
    available: boolean
}

export class Reservation {
    rider: Rider
    driver: Driver | null
    destination: string
    price: number
    isCanceled: boolean

    constructor(rider: Rider, destination: string) {
        this.rider = rider
        this.destination = destination
        this.driver = null
        this.price = 0
        this.isCanceled = false
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

        this.isCanceled = true
        return 'Reservation canceled.'
    }
}
