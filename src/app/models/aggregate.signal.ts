import { Signal, SignalParameters } from '@app/models/signal';

export class AggregateSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    signal1: Signal;
    signal2: Signal;

    constructor(signal1: Signal, signal2: Signal) {
        super();
        this.signal1 = signal1;
        this.signal2 = signal2;
    }

    formula(n: number, N: number): number {
        return this.signal1.cachedFormula(n, N) + this.signal2.cachedFormula(n, N);
    }

    override clone(): Signal {
        return new AggregateSignal(this.signal1.clone(), this.signal2.clone());
    }
}
