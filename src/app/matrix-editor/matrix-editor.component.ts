import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-matrix-editor',
  templateUrl: './matrix-editor.component.html',
  styleUrls: ['./matrix-editor.component.scss']
})
export class MatrixEditorComponent implements OnChanges {
    @Input() m!: number;
    @Input() matrix!: number[][];

    @Output() mChange = new EventEmitter<number>();
    @Output() matrixChange = new EventEmitter<number[][]>();
    @Output() dataChanged = new EventEmitter<void>();

    matrixSize = 3;
    isDirty = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['matrix']) {
            this.matrixSize = this.matrix.length;
        }
    }

    changeM(m: number) {
        this.m = m;
        this.mChange.emit(m);
        this.isDirty = true;
    }

    changeSize(size: number) {
        if (!Number.isInteger(size) || size % 2 !== 1 || size < 3 || size > 7) return;

        let matrix!: number[][];

        if (this.matrixSize < size) {
            matrix = [
                ...this.matrix.map(x => [...x, ...Array(size - this.matrixSize).fill(0)]),
                ...Array(size - this.matrixSize).fill(Array(size).fill(0))
            ];
        } else if (this.matrixSize > size) {
            matrix = this.matrix.slice(0, size).map(x => x.slice(0, size));
            console.log(matrix);
        } else {
            matrix = [ ...this.matrix.map(x => x) ];
        }

        this.matrixChange.emit(matrix);
        this.isDirty = true;
    }

    elementChanged(i: number, j: number, value: any) {
        const matrix = [
            ...this.matrix.slice(0, i),
            [...this.matrix[i].slice(0, j), value.target!.value, ...this.matrix[i].slice(j + 1)],
            ...this.matrix.slice(i + 1)
        ];

        this.matrixChange.emit(matrix);
        this.isDirty = true;
    }

    submit() {
        this.isDirty = false;
        this.dataChanged.emit();
    }
}
