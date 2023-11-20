import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { CorrelationSignal } from '@app/models/correlation.signal';
import { Range } from '@app/models/range';

@Component({
    selector: 'app-correlation-action',
    templateUrl: './correlation-action.component.html',
    styleUrls: ['./correlation-action.component.scss']
})
export class CorrelationActionComponent {
    signal: Signal | undefined = undefined;
    private readonly signals: (Signal | undefined)[] = [undefined, undefined];

    ranges: { from: number, to: number }[] = [undefined!, undefined!];

    signalChanged(signal: Signal, index: number) {
        this.signals[index] = signal;

        this.updateSignal();
    }

    rangeChanged(range: {from: number, to: number}, index: number) {
        this.ranges[index] = range;

        this.updateSignal();
    }

    updateSignal() {
        if (!this.signals[0] || !this.signals[1] || !this.ranges[0] || !this.ranges[1]) return;


        this.signal = new CorrelationSignal(
            this.signals[0],
            new Range(this.ranges[0].from, this.ranges[0].to),
            this.signals[1],
            new Range(this.ranges[1].from, this.ranges[1].to));
    }
}
