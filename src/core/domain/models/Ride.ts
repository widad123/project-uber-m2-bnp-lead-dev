export class Ride {
    constructor(
        public id: string,
        public rider_id: string,
        public driver_id: string | null,
        public origin: string,
        public destination: string,
        public distance: number,
        public price: number,
        public is_uberx: boolean = false,
        public status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    ) {}

    isPending(): boolean {
        return this.status === 'pending'
    }

    confirmRide(driver_id: string): void {
        if (this.isPending()) {
            this.driver_id = driver_id
            this.status = 'confirmed'
        }
    }

    cancelRide(): void {
        if (this.status !== 'cancelled') {
            this.status = 'cancelled'
        }
    }
}
