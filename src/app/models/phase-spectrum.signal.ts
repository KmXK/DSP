import { Signal, SignalParameters } from '@app/models/signal';

export class PhaseSpectrumSignal extends Signal {
    constructor(private readonly signal: Signal) {
        super();
    }

    override readonly parameters: SignalParameters = {};

    formula(n: number, N: number): number {
        const indices = Array.from(Array(N).keys());

        const cosSum = indices.reduce((x, i) => x + this.signal.formula(i, N) * Math.cos(2 * Math.PI * i * n / N), 0);
        const sinSum = indices.reduce((x, i) => x + this.signal.formula(i, N) * Math.sin(2 * Math.PI * i * n / N), 0);

        const cos = 2 / N * cosSum;
        const sin = 2 / N * sinSum;

        return Math.atan(sin / (cos + 0.00001));
    }

    override clone(): Signal {
        const signal = new PhaseSpectrumSignal(this.signal);
        signal.copyParameters(this);
        return signal;
    }
}
