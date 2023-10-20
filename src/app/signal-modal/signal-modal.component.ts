import { Component, Inject } from '@angular/core';
import { Signal } from '@app/models/signal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-signal-modal',
    templateUrl: './signal-modal.component.html',
    styleUrls: ['./signal-modal.component.scss']
})
export class SignalModal {
    signal: Signal;

    constructor(
        public dialogRef: MatDialogRef<SignalModal>,
        @Inject(MAT_DIALOG_DATA) public data: { signal: Signal }
    ) {
        this.signal = data.signal;
    }
}
