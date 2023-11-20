import { Signal, SignalParameters } from '@app/models/signal';
import { Range } from '@app/models/range';

export class CutSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    constructor(
        private signal: Signal,
        private range: Range
    ) {
        super();
    }


    formula(n: number, N: number): number {
        if (n < this.range.from || n > this.range.to) {
            return 0;
        }

        return this.signal.cachedFormula(n, N);
    }

    override clone(): Signal {
        return new CutSignal(this.signal.clone(), this.range);
    }
}
