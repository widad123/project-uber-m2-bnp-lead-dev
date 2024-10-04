export class Ride {
    constructor(
        public id: string,
        public riderId: string,
        public driverId: string | null,
        public origin: string,
        public destination: string,
        public distance: number,
        public price: number,
        public isUberX: boolean = false,
        public status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    ) {}

    isPending(): boolean {
        return this.status === 'pending'
    }

    confirmRide(driverId: string): void {
        if (this.isPending()) {
            this.driverId = driverId
            this.status = 'confirmed'
        }
    }

    cancelRide(): void {
        if (this.status !== 'cancelled') {
            this.status = 'cancelled'
        }
    }
}
