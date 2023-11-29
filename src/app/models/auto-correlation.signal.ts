import { Signal, SignalParameters } from '@app/models/signal';
import { Range } from '@app/models/range';
import { CorrelationSignal } from '@app/models/correlation.signal';
import { CutSignal } from '@app/models/cut.signal';

export class AutoCorrelationSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    correlationSignal: CorrelationSignal;

    constructor(
        private signal1: Signal,
        private range1: Range
    ) {
        super();

        if (range1.length < 0) {
            throw new Error("1 signal''s length must be greater than 2 signal''s length");
        }

        this.definedRange = new Range(-100, 100);

        this.correlationSignal = new CorrelationSignal(
            new CutSignal(this.signal1, this.range1),
            new Range(this.range1.from - 100, this.range1.to + 100),
            this.signal1,
            this.range1);
    }

    formula(n: number, N: number): number {
        return this.correlationSignal.cachedFormula(n + 100, N);
    }

    override clone(): Signal {
        return new AutoCorrelationSignal(this.signal1, this.range1);
    }
}
