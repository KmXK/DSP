import { Signal, SignalParameters } from '@app/models/signal';

export type SmoothFunction = (i: number, get: (i: number) => number) => number;

export class SmoothedSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    constructor(
        private readonly signal: Signal,
        private readonly func: SmoothFunction
    ) {
        super();
    }

    formula(n: number, N: number): number {
        return this.func(n, i => this.signal.cachedFormula(i, N));
    }

    override clone(): Signal {
        const signal = new SmoothedSignal(this.signal, this.func);
        signal.copyParameters(this);
        return signal;
    }
}
