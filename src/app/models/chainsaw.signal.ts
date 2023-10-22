import { Signal, SignalParameters } from '@app/models/signal';

export class ChainsawSignal extends Signal {
    override readonly _parameters: SignalParameters = {
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

        const result = -2 * a / Math.PI * Math.atan(1 / Math.tan(Math.PI * f * n / N + phi));

        if (this.normalized) {
            return result + a;
        }

        return result;
    }

    override clone(): Signal {
        const signal = new ChainsawSignal();
        signal.copyParameters(this);
        return signal;
    }
}
