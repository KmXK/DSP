import { Signal, SignalParameters } from '@app/models/signal';
import { Range } from '@app/models/range';

export class StaticSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    override definedRange?: Range;

    constructor(private values: number[]) {
        super();

        this.definedRange = new Range(0, this.values.length);
    }

    formula(n: number, N: number): number {
        return n < this.values.length ? this.values[n] : 0;
    }

    override clone(): Signal {
        return new StaticSignal(this.values);
    }
}
