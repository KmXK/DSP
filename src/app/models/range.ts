export class Range {
    constructor(public from: number, public to: number) {
    }

    get length(): number {
        return this.to - this.from + 1;
    }
}
