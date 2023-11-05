import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Signal } from '@app/models/signal';
import { SignalParameterValidator } from '@app/shared/validators/signal.validator';
import { MatDialog } from '@angular/material/dialog';
import { SignalModal } from '@app/signal-modal/signal-modal.component';

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements OnInit, OnChanges {
    @Input() signal!: Signal;
    @Input() dragable = true;
    @Input() canChooseParameter = false;
    @Input() fullscreen = true;
    @Input() width = 0;
    @Input() height = 0;
    @Input() fixedN: number | undefined = undefined;
    @Input() range?: { from: number, to: number } = undefined;
    @Input() visibleRange?: { from: number, to: number } = undefined;
    @Input() editRangeBounds?: { from: number, to: number } = undefined;
    @Input() editRange?: { from: number, to: number } = undefined;
    @Output() changed = new EventEmitter<Signal>();
    @Output() parameterChoose = new EventEmitter<string>();
    @Output() nChanged = new EventEmitter<number>();
    @Output() editRangeChange = new EventEmitter<{from: number, to: number}>();
    N: number = 128;
    hasParameters = false;
    histogramOptions: any = {
        data: [
            {
                type: 'scatter'
            }
        ],
        layout: {
            autosize: false,
            xaxis: {
                autorange: false,
                range: [-5, 10]
            },
            yaxis: {
                autorange: true
            },
            margin: {
                l: 30,
                r: 30,
                b: 30,
                t: 30
            }
        }
    };
    formGroup!: FormGroup;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.nChanged.emit(this.N);

        this.histogramOptions.layout.xaxis.range = [
            (this.visibleRange?.from ?? this.range?.from ?? 0) - 0.2,
            this.visibleRange?.to ?? this.range?.to ?? 3 * this.N];
    }

    calculatePoints(): void {
        new Promise<{ x: number, y: number }[]>(resolve => {
            Object.entries(this.formGroup.controls).forEach(([key, control]) => {
                if (this.signal.parameters[key]) {
                    this.signal.setParameter(key, control.value);
                }
            })

            resolve(this.signal.getValues(this.range || { from: 0, to: this.N * 3 }, this.N));
        }).then(points => {
            this.histogramOptions.data[0].x = points.map(x => x.x);
            this.histogramOptions.data[0].y = points.map(x => x.y);

            this.changed.emit(this.signal);
        });
    }

    getErrorMessage(controlKey: string): string | null {
        const control = this.formGroup.get(controlKey);

        if (control?.errors?.['required']) {
            return 'This field is required';
        }

        if (control?.errors?.['SignalParameterValidator']) {
            return control?.errors?.['SignalParameterValidator'];
        }

        return null;
    }

    openFullscreen() {
        this.dialog.open(SignalModal, {
            data: {
                signal: this.signal
            }
        }).afterClosed().subscribe(() => {
            Object
                .entries(this.signal.parameters)
                .forEach(([name, p]) => this.formGroup.controls[name].setValue(p.value));

            this.calculatePoints();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['signal'] && changes['signal']) {
            const controls: Record<string, FormControl> = {};

            if (Object.entries(this.signal.parameters).length) {
                this.histogramOptions.layout.width = this.width;
                this.histogramOptions.layout.height = this.height;
            } else {
                this.histogramOptions.layout.width = this.width + 170;
                this.histogramOptions.layout.height = this.height;
            }

            Object.entries(this.signal.parameters)
                .forEach(([name, p]) => controls[name] = new FormControl(
                    p.value,
                    [
                        Validators.required,
                        SignalParameterValidator(p)
                    ]));

            this.formGroup = new FormGroup(controls);
            this.hasParameters = Object.entries(this.signal.parameters).length > 0;

            this.calculatePoints();
        }
    }

    onNChanged() {
        this.calculatePoints();
        this.nChanged.emit(this.N);

        this.histogramOptions.layout.xaxis.range = [
            this.visibleRange?.from ?? this.range?.from ?? 0,
            this.visibleRange?.to ?? this.range?.to ?? 3 * this.N];
    }

    setEditedRange(range: { from?: number, to?: number }) {
        if (range.from !== undefined) {
            this.editRange = { ...this.editRange!, from: range.from };
        } else if (range.to !== undefined) {
            this.editRange = { ...this.editRange!, to: range.to };
        }

        this.editRangeChange.emit(this.editRange);
    }
}
