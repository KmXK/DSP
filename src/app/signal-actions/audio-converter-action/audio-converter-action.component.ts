import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';

@Component({
    selector: 'app-audio-converter-action',
    templateUrl: './audio-converter-action.component.html',
    styleUrls: ['./audio-converter-action.component.scss']
})
export class AudioConverterActionComponent {
    signal: Signal = undefined!;

    setSignal(signal: Signal) {
        this.signal = signal;
    }
}
