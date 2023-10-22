import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { AmplitudeSpectrumSignal } from '@app/models/amplitude-spectrum.signal';
import { PhaseSpectrumSignal } from '@app/models/phase-spectrum.signal';
import { RecoveredSignal } from '@app/models/recovered.signal';

@Component({
    selector: 'app-fourier-transform-action',
    templateUrl: './fourier-transform-action.component.html',
    styleUrls: ['./fourier-transform-action.component.scss']
})
export class FourierTransformActionComponent {
    signal: Signal | undefined = undefined;

    amplitudeSpectrumSignal: AmplitudeSpectrumSignal | undefined = undefined;
    phaseSpectrumSignal: PhaseSpectrumSignal | undefined = undefined;
    recoveredSignal: RecoveredSignal | undefined = undefined;

    N: number = 128;

    signalChanged(signal: Signal) {
        this.signal = signal;
        this.amplitudeSpectrumSignal = new AmplitudeSpectrumSignal(signal);
        this.phaseSpectrumSignal = new PhaseSpectrumSignal(signal);

        this.recoveredSignal = new RecoveredSignal(this.amplitudeSpectrumSignal, this.phaseSpectrumSignal, this.N);
    }

    onNChanged(n: number) {
        this.N = n;
        this.signalChanged(this.signal!);
    }
}
