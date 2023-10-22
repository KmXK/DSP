import { Signal, SignalParameters } from '@app/models/signal';

export class PhaseSpectrumSignal extends Signal {
    constructor(private readonly signal: Signal) {
        super();
    }

    override readonly _parameters: SignalParameters = {};

    formula(n: number, N: number): number {
        let cosSum = 0, sinSum = 0;

        for (let i = 0; i < N; i++) {
            const value = this.signal.cachedFormula(i, N);
            const tv = 2 * Math.PI * i * n / N;

            cosSum += value * Math.cos(tv);
            sinSum += value * Math.sin(tv);
        }

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
