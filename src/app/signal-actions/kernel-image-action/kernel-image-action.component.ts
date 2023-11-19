import { Component } from '@angular/core';

@Component({
    selector: 'app-kernel-image-action',
    templateUrl: './kernel-image-action.component.html',
    styleUrls: ['./kernel-image-action.component.scss']
})
export class KernelImageActionComponent {
    selectedKernelType: number = 0;
    kernelTypes = [
        {
            name: 'Box blur',
            m: 1 / 9,
            matrix: Array(3).fill(Array(3).fill(1))
        },
        {
            name: 'Gaussian blur 3x3',
            m: 1 / 16,
            matrix: [
                [1,2,1],
                [2,4,2],
                [1,2,1]
            ]
        },
        {
            name: 'Gaussian blur 5x5',
            m: 1 / 256,
            matrix: [
                [1, 4, 6, 4, 1],
                [4, 16, 24, 16, 4],
                [6, 24, 36, 24, 6],
                [4, 16, 24, 16, 4],
                [1, 4, 6, 4, 1]
            ]
        },
        {
            name: 'Sharpen',
            m: 1,
            matrix: [
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0]
            ]
        },
        {
            name: 'Edge (HV)',
            m: 1,
            matrix: [
                [0, -1, 0],
                [-1, 4, -1],
                [0, -1, 0]
            ]
        },
        {
            name: 'Edge (ALL)',
            m: 1,
            matrix: [
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
            ]
        },
        {
            name: 'Sobel Horizontal',
            m: 1,
            matrix: [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]
            ]
        },
        {
            name: 'Sobel Vertical',
            m: 1,
            matrix: [
                [1, 2, 1],
                [0, 0, 0],
                [-1, -2, -1]
            ]
        },
        {
            name: 'Custom',
            m: 1,
            matrix: [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ]
        }
    ];

    imageData!: { r: number; g: number; b: number; a: number }[][];
    outputImage!: string; // base64

    matrixSize = 3;

    changeKernelType(kernelTypeIndex: number): void {
        this.selectedKernelType = kernelTypeIndex;
        this.updateOutputImage();
    }

    setImage(imageData: { r: number; g: number; b: number; a: number }[][]) {
        this.imageData = imageData;
        this.updateOutputImage();
    }

    updateOutputImage(): void {
        const newImage = this.processImage();
        this.outputImage = this.generateBase64(newImage);
    }

    private processImage(): { r: number, g: number, b: number, a: number }[][] {
        const kernelType = this.kernelTypes[this.selectedKernelType];

        const dx = Math.floor(kernelType.matrix.length / 2);

        return this.imageData.map((row, rowIndex) => {
            return row.map((pixel, pixelIndex) => {
                if (rowIndex < dx || pixelIndex < dx ||
                    rowIndex > this.imageData.length - 1 - dx ||
                    pixelIndex > this.imageData[0].length - 1 - dx
                ) {
                    return {...pixel};
                }

                let result = {r: 0, g: 0, b: 0, a: 255};

                for (let i = 0; i < kernelType.matrix.length; i++) {
                    for (let j = 0; j < kernelType.matrix[i].length; j++) {
                        const fromX = pixelIndex - dx + i;
                        const fromY = rowIndex - dx + j;

                        const fromPixel = this.imageData[fromY][fromX];

                        result.r += kernelType.matrix[i][j] * fromPixel.r;
                        result.g += kernelType.matrix[i][j] * fromPixel.g;
                        result.b += kernelType.matrix[i][j] * fromPixel.b;
                    }
                }

                result.r *= kernelType.m;
                result.g *= kernelType.m;
                result.b *= kernelType.m;

                result.r = result.r < 0 ? 0 : result.r > 255 ? 255 : result.r;
                result.g = result.g < 0 ? 0 : result.g > 255 ? 255 : result.g;
                result.b = result.b < 0 ? 0 : result.b > 255 ? 255 : result.b;

                return result;
            })
        });
    }

    private generateBase64(pixelData: { r: number; g: number; b: number; a: number }[][]): string {
        const width = pixelData[0].length;
        const height = pixelData.length;

        console.log(width, height);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error("Unable to get 2D context for canvas");
        }

        canvas.width = width;
        canvas.height = height;

        const flatPixelData = pixelData.flatMap(x => x).map(x => [x.r, x.g, x.b, x.a]).flat();

        const imageData = new ImageData(new Uint8ClampedArray(flatPixelData), width, height);

        context.putImageData(imageData, 0, 0);

        const base64Image = canvas.toDataURL('image/png');

        return base64Image;
    }

    toCustom() {
        const currentData = this.kernelTypes[this.selectedKernelType];
        this.kernelTypes[this.kernelTypes.length - 1].m = currentData.m;
        this.kernelTypes[this.kernelTypes.length - 1].matrix = currentData.matrix.slice().map(x => x.slice());
        this.selectedKernelType = this.kernelTypes.length - 1;
    }
}
