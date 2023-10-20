import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Signal } from '@app/models/signal';

@Component({
  selector: 'app-signal-drop',
  templateUrl: './signal-drop.component.html',
  styleUrls: ['./signal-drop.component.scss']
})
export class SignalDropComponent {
    @Input() canChooseParameters = false;

    @Output() parameterChoose = new EventEmitter<string>();
    @Output() signalChanged = new EventEmitter<Signal>();

    signal: Signal | undefined = undefined;

    drop(event: CdkDragDrop<any, any>) {
        this.signal = event.item.data.clone();

        this.signalChanged.emit(this.signal);
    }
}
