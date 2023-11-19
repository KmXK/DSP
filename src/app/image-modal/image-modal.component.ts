import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-image-modal',
    templateUrl: './image-modal.component.html',
    styleUrls: ['./image-modal.component.scss']
})
export class ImageModal {
    src: string;

    constructor(
        public dialogRef: MatDialogRef<ImageModal>,
        @Inject(MAT_DIALOG_DATA) data: { src: string }
    ) {
        this.src = data.src;
    }
}
