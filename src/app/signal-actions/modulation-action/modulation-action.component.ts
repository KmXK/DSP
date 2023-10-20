import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { ModulatedSignal } from '@app/models/modulated.signal';

@Component({
    selector: 'app-modulation-action',
    templateUrl: './modulation-action.component.html',
    styleUrls: ['./modulation-action.component.scss']
})
export class ModulationActionComponent {
    private readonly signals: (Signal | undefined)[] = [undefined, undefined];

    signal: Signal | undefined = undefined;
    parameter: string = '';

    signalChanged(signal: Signal, index: number) {
        if (index !== -1) {
            this.signals[index] = signal;
        }

        this.updateSignal();
    }

    updateSignal() {
        if (this.signals.every(x => x) && this.parameter) {
            this.signal = new ModulatedSignal(this.signals[1]!, this.signals[0]!, this.parameter);
        }
    }

    parameterChoose(parameter: string) {
        this.parameter = parameter;
        this.updateSignal();
    }
}
