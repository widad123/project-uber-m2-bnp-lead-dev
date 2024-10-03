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

    constructor(rider: Rider, destination: string) {
        this.rider = rider
        this.destination = destination
        this.driver = null
        this.price = 0
    }

    assignDriver(driver: Driver) {
        this.driver = driver
    }

    isConfirmed(): boolean {
        return this.driver !== null
    }
}
