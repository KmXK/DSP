import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { AggregateSignal } from '@app/models/aggregate.signal';

@Component({
    selector: 'app-combination-action',
    templateUrl: './combination-action.component.html',
    styleUrls: ['./combination-action.component.scss']
})
export class CombinationActionComponent {
    signal: Signal | undefined = undefined;
    private readonly signals: (Signal | undefined)[] = [undefined, undefined];

    signalChanged(signal: Signal, index: number) {
        this.signals[index] = signal;

        if (this.signals.every(x => x)) {
            this.signal = new AggregateSignal(this.signals[0]!, this.signals[1]!);
        }
    }
}
