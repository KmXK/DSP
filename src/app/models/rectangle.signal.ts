import { Signal, SignalParameters } from '@app/models/signal';

export class RectangleSignal extends Signal {
    override readonly parameters: SignalParameters = {
        A: {
            name: 'A',
            value: 1
        },
        T: {
            name: 'T',
            value: 1
        },
        dc: {
            name: 'dc',
            value: 0.5
        }
    };

    formula(n: number, N: number): number {
        const a = this.getParameterValue('A', n, N);
        const t = this.getParameterValue('T', n, N);
        const dc = this.getParameterValue('dc', n, N);

        const value = (n / N / t) % 1;

        if (this.normalized) {
            return value < dc ? 2 * a : 0;
        }

        return value < dc ? a : -a;
    }

    override clone(): Signal {
        const signal = new RectangleSignal();
        signal.copyParameters(this);
        return signal;
    }
}
