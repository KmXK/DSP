import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageModal } from '@app/image-modal/image-modal.component';

@Component({
    selector: 'app-image-picker',
    templateUrl: './image-picker.component.html',
    styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent {
    @ViewChild('imageContainer') imageComponent!: ElementRef;
    @ViewChild('imageInput') imageInput!: ElementRef;
    @ViewChild('imageElement') imageElement!: ElementRef;

    selectedImageSrc: string | null = null;

    @Output() imageChanged = new EventEmitter<{ r: number, g: number, b: number, a: number }[][]>;

    constructor(private dialog: MatDialog) {
    }

    handleImageClick(event: MouseEvent) {
        if (this.selectedImageSrc && event.shiftKey) {
            this.dialog.open(ImageModal, { data: { src: this.selectedImageSrc } });
            return;
        }

        this.imageInput.nativeElement.click();
    }

    handleImageUpload(event: any) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                this.selectedImageSrc = e.target.result;

                setTimeout(() => {
                    this.imageChanged.emit(this.imageTo2DArray(this.imageElement.nativeElement));
                });
            };

            reader.readAsDataURL(input.files[0]);

        }
    }

    imageTo2DArray(imageElement: HTMLImageElement): { r: number, g: number, b: number, a: number }[][] {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Unable to get 2D context for canvas');
        }

        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;

        console.log(imageElement);

        context.drawImage(imageElement, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        const pixelArray: { r: number, g: number, b: number, a: number }[] = [];

        for (let i = 0; i < imageData.length; i += 4) {
            const pixel = { r: imageData[i], g: imageData[i + 1], b: imageData[i + 2], a: imageData[i + 3] };
            pixelArray.push(pixel);
        }

        const width = canvas.width;
        const result: { r: number, g: number, b: number, a: number }[][] = [];

        for (let i = 0; i < pixelArray.length; i += width) {
            result.push(pixelArray.slice(i, i + width));
        }

        return result;
    }
}
