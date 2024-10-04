export class Rider {
    constructor(
        public id: string,
        public name: string,
        public balance: number,
        public birthday: Date,
        public isFirstRide: boolean = true
    ) {}

    hasSufficientFunds(amount: number): boolean {
        return this.balance >= amount
    }
}
