import { Signal, SignalParameters } from '@app/models/signal';
import { AmplitudeSpectrumSignal } from '@app/models/amplitude-spectrum.signal';
import { PhaseSpectrumSignal } from '@app/models/phase-spectrum.signal';

export class RecoveredSignal extends Signal {
    override readonly parameters: SignalParameters = {
    };

    constructor(private readonly amplitudeSpectrumSignal: AmplitudeSpectrumSignal,
                private readonly phaseSpectrumSignal: PhaseSpectrumSignal,
                private readonly initialN: number) {
        super();
    }

    formula(n: number, N: number): number {
        const indices = Array.from(Array(this.initialN / 2).keys());

        return indices.reduce((x, i) => x +
            this.amplitudeSpectrumSignal.formula(i, this.initialN) *
            Math.cos(2 * Math.PI * i * n / N - this.phaseSpectrumSignal.formula(i, this.initialN)), 0);
    }

    override clone(): Signal {
        return new RecoveredSignal(
            <AmplitudeSpectrumSignal>this.amplitudeSpectrumSignal.clone(),
            <PhaseSpectrumSignal>this.phaseSpectrumSignal.clone(),
            this.initialN);
    }
}
