import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { Range } from '@app/models/range';
import { AutoCorrelationSignal } from '@app/models/auto-correlation.signal';

@Component({
    selector: 'app-auto-correlation-action',
    templateUrl: './auto-correlation-action.component.html',
    styleUrls: ['./auto-correlation-action.component.scss']
})
export class AutoCorrelationActionComponent {
    signal: Signal | undefined = undefined;

    inputSignal?: Signal = undefined;
    range?: Range = undefined;

    signalChanged(signal: Signal) {
        this.inputSignal = signal;

        this.updateSignal();
    }

    rangeChanged(range: {from: number, to: number}) {
        this.range = new Range(range.from, range.to);

        this.updateSignal();
    }

    updateSignal() {
        if (!this.range || !this.inputSignal) return;

        this.signal = new AutoCorrelationSignal(
            this.inputSignal,
            this.range);
    }
}
