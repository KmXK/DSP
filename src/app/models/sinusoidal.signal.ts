import { Signal, SignalParameters } from '@app/models/signal';

export class SinusoidalSignal extends Signal {
    override readonly parameters: SignalParameters = {
        A: {
            name: 'A',
            value: 1
        },
        f: {
            name: 'f',
            value: 1
        },
        phi: {
            name: 'φ',
            value: 0
        }
    };

    formula(n: number, N: number): number {
        const a = this.getParameterValue('A', n, N);
        const f = this.getParameterValue('f', n, N);
        const phi = this.getParameterValue('phi', n, N);

        const result = a * Math.sin(2 * Math.PI * f * n / N + phi);

        if (this.normalized) {
            return result + a;
        }

        return result;
    }

    override clone(): Signal {
        const signal = new SinusoidalSignal();
        signal.copyParameters(this);
        return signal;
    }
}
