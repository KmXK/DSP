import { Component } from '@angular/core';

@Component({
    selector: 'app-image-correlation-action',
    templateUrl: './image-correlation-action.component.html',
    styleUrls: ['./image-correlation-action.component.scss']
})
export class ImageCorrelationActionComponent {
    imageData!: { r: number; g: number; b: number; a: number }[][];
    searchImageData!: { r: number; g: number; b: number; a: number }[][];
    outputImage!: string; // base64

    histogramOptions: any = {
        data: [
            {
                type: 'surface'
            }
        ],
        layout: {
            autosize: true,
            xaxis: {
                autorange: true
            },
            yaxis: {
                autorange: true
            }
        }
    };

    setImage(imageData: { r: number; g: number; b: number; a: number }[][], index: number) {
        imageData = imageData.map(x => x.map(y => ({ r: y.r / 255, g: y.g / 255, b: y.b / 255, a: y.a })));

        if (index === 0) this.imageData = imageData;
        else this.searchImageData = imageData;

        this.updateOutputImage();
    }

    updateOutputImage(): void {
        if (!this.imageData || !this.searchImageData) return;

        const newImage = this.processImage();
        console.log(newImage);
        this.histogramOptions.data[0].z = newImage;
        //this.outputImage = this.generateBase64(newImage);
    }

    private processImage(): number[][] {
        let cache: any = [];

        const medium = (image: { r: number, g: number, b: number, a: number }[][],
                        i: number, j: number, w: number, h: number) => {
            // const m = image
            //     .flat()
            //     .reduce(
            //         (r, v) => ({ r: r.r + v.r, g: r.g + v.g, b: r.b + v.b, a: r.a + v.a }),
            //         { r: 0, g: 0, b: 0, a: 0 });
            //
            // m.r /= (image.length * image[0].length);
            // m.g /= (image.length * image[0].length);
            // m.b /= (image.length * image[0].length);
            // m.a /= (image.length * image[0].length);
            //
            // return m;

            const area = image.slice(j, j + h).map(x => x.slice(i, i + w));

            if (i == 167) console.log(area, w, h);

            let result = { r: 0, g: 0, b: 0 };
            for (let y = 0; y < h; y++) {
                let sum = {r: 0, g: 0, b: 0};
                if (cache[j][i][y]) {
                    sum = cache[j][i][y];
                } else {
                    for (let x = 0; x < w; x++) {
                        try {
                            sum.r += area[y][x].r;
                            sum.g += area[y][x].g;
                            sum.b += area[y][x].b;
                        }
                        catch{
                            console.log(x, y);
                            throw {};
                        }
                    }
                    cache[j][i][y] = sum;
                }


                result.r += sum.r / w;
                result.g += sum.g / w;
                result.b += sum.b / w;
            }

            return {
                r: result.r / h,
                g: result.g / h,
                b: result.b / h,
            };


            // const r = area.flat().sort((a, b) => a.r - b.r)[Math.floor((w * h) / 2)].r;
            // const g = area.flat().sort((a, b) => a.g - b.g)[Math.floor((w * h) / 2)].g;
            // const b = area.flat().sort((a, b) => a.b - b.b)[Math.floor((w * h) / 2)].b;
            //
            // return {r,g,b,a:255};
        };

        const result = new Array(this.imageData.length - this.searchImageData.length + 1).fill(0)
            .map(() => new Array(this.imageData[0].length - this.searchImageData[0].length + 1).fill(0));

        cache = new Array(this.imageData.length - this.searchImageData.length + 1).fill(0)
            .map(() => new Array(this.imageData[0].length - this.searchImageData[0].length + 1).fill(0)
                .map(() => new Array(this.searchImageData.length + 1).fill(undefined)));

        const w = this.searchImageData[0].length;
        const h = this.searchImageData.length;

        const medium2 = medium(this.searchImageData, 0, 0, w, h);

        for (let u = 0; u < this.imageData.length - this.searchImageData.length; u++) {
            console.log(`${u}/${ this.imageData.length - this.searchImageData.length}`);
            for (let v = 0; v < this.imageData[0].length - this.searchImageData[0].length; v++) {
                const medium1 = medium(this.imageData, v, u, w, h);
                let nominator = 0, d1 = 0, d2 = 0;

                for (let cy = 0; cy < this.searchImageData.length; cy++) {
                    for (let cx = 0; cx < this.searchImageData[0].length; cx++) {
                        const y = cy + u;
                        const x = cx + v;

                        nominator +=
                            (this.imageData[y][x].r - medium1.r) * (this.searchImageData[cy][cx].r - medium2.r) +
                            (this.imageData[y][x].g - medium1.g) * (this.searchImageData[cy][cx].g - medium2.g) +
                            (this.imageData[y][x].b - medium1.b) * (this.searchImageData[cy][cx].b - medium2.b);

                        d1 +=
                            (this.imageData[y][x].r - medium1.r) * (this.imageData[y][x].r - medium1.r) +
                            (this.imageData[y][x].g - medium1.g) * (this.imageData[y][x].g - medium1.g) +
                            (this.imageData[y][x].b - medium1.b) * (this.imageData[y][x].b - medium1.b);

                        d2 +=
                            (this.searchImageData[cy][cx].r - medium2.r) * (this.searchImageData[cy][cx].r - medium2.r) +
                            (this.searchImageData[cy][cx].g - medium2.g) * (this.searchImageData[cy][cx].g - medium2.g) +
                            (this.searchImageData[cy][cx].b - medium2.b) * (this.searchImageData[cy][cx].b - medium2.b);
                    }
                }
                result[u][v] = nominator / Math.sqrt(d1 * d2);
            }
        }

        return result;
    }

    private generateBase64(pixelData: { r: number; g: number; b: number; a: number }[][]): string {
        const width = pixelData[0].length;
        const height = pixelData.length;

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
}
