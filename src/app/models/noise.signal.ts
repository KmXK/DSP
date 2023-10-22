import { Signal, SignalParameters } from '@app/models/signal';

export class NoiseSignal extends Signal {
    override readonly _parameters: SignalParameters = {
        A: {
            name: 'A',
            value: 1
        }
    };

    formula(n: number, N: number): number {
        const a = this.getParameterValue('A', n, N);

        if (this.normalized) {
            return a * Math.random();
        }

        return a * (Math.random() * 2 - 1);
    }

    period(): number {
        return 1;
    }

    override clone(): Signal {
        const signal = new NoiseSignal();
        signal.copyParameters(this);
        return signal;
    }
}
