import { Signal, SignalParameters } from '@app/models/signal';
import { Range } from '@app/models/range';

export class CorrelationSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    constructor(
        private signal1: Signal,
        private range1: Range,
        private signal2: Signal,
        private range2: Range
    ) {
        super();

        if (range1.length < 0 || range2.length < 0 || range1.length < range2.length) {
            throw new Error("1 signal''s length must be greater than 2 signal''s length");
        }

        this.definedRange = new Range(0, this.range1.length - this.range2.length);
    }

    formula(n: number, N: number): number {
        const dl = this.range1.length - this.range2.length;
        if (n < 0 || n > dl) return 0;

        let nominator = 0;
        for (let i = 0; i < this.range2.length; i++) {
            nominator += this.signal1.cachedFormula(this.range1.from + i + n, N) *
                this.signal2.cachedFormula(this.range2.from + i, N);
        }

        const sum = (s: Signal, from: number, l: number) => {
            let sum = 0;
            for (let i = from; i < from + l; i++) {
                const v = s.cachedFormula(i, N)
                sum += v * v;
            }
            return sum;
        }

        const denominator = Math.sqrt(
            sum(this.signal1, this.range1.from + n, this.range2.length) *
            sum(this.signal2, 0, this.range2.length));

        return nominator / denominator;
    }

    override clone(): Signal {
        return new CorrelationSignal(this.signal1, this.range1, this.signal2, this.range2);
    }
}
