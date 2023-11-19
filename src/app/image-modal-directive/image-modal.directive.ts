import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageModal } from '@app/image-modal/image-modal.component';

@Directive({
  selector: '[app-image-modal]'
})
export class ImageModalDirective {
    constructor(private el: ElementRef,
                private dialog: MatDialog) {
    }

    @HostListener('click', ['$event'])
    onClick() {
        this.dialog.open(ImageModal, {
            data: {
                src: this.el.nativeElement.src
            }
        });
    }
}
