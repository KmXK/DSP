import { Signal, SignalParameters } from '@app/models/signal';

export class StaticSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    constructor(private values: number[]) {
        super();
    }

    formula(n: number, N: number): number {
        return n < this.values.length ? this.values[n] : 0;
    }

    override clone(): Signal {
        return new StaticSignal(this.values);
    }
}
