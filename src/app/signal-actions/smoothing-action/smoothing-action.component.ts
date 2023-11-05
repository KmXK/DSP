import { Component } from '@angular/core';
import { Signal } from '@app/models/signal';
import { SmoothedSignal, SmoothFunction } from '@app/models/smoothed.signal';

@Component({
    selector: 'app-smoothing-action',
    templateUrl: './smoothing-action.component.html',
    styleUrls: ['./smoothing-action.component.scss']
})
export class SmoothingActionComponent {
    signal: Signal | undefined = undefined;
    smoothedSignal: Signal | undefined = undefined;
    algoNumber: number = 0;
    k: number = 1;
    kStep = 1;
    n: number = 128;

    smoothingAlgorithms: SmoothingData[] = [
        {
            name: 'Среднее арифметическое',
            kStep: 1,
            func: k => (i, get) => this.fromTo(i, k, (from, to) => {
                let result = 0;
                for (let j = from; j <= to; j++) {
                    result += get(j);
                }
                return result / (to - from + 1);
            })
        },
        {
            name: 'Медианное',
            kStep: 2,
            func: k => (i, get) => this.fromTo(i, k, (from, to) => {
                if (to - from + 1 !== k) {
                    return get(i);
                }

                const values = Array(to - from + 1).fill(0);
                for (let j = from; j <= to; j++) {
                    values[j - from] = get(j);
                }
                values.sort((a, b) => a - b);

                if (values.length % 2 === 0) {
                    return (values[values.length >> 1] + values[values.length >> 1 - 1]) >> 1;
                }

                return values[values.length >> 1];
            })
        },
        //{ name: '' }
    ];

    signalChanged(signal: Signal): void {
        this.signal = signal;
        this.createSmoothedSignal();
    }

    createSmoothedSignal(): void {
        const smoothingAlgorithm = this.smoothingAlgorithms[this.algoNumber];

        this.smoothedSignal = new SmoothedSignal(
            this.signal!,
            smoothingAlgorithm.func(this.k));
    }

    algoChanged(algoNumber: number): void {
        this.algoNumber = algoNumber;
        this.kStep = this.smoothingAlgorithms[this.algoNumber].kStep;
        if (this.k % 2 === 0) this.k = this.k === 0 ? 1 : this.k - 1;
        this.createSmoothedSignal();
    }

    changeN(n: number) {
        this.n = n;
        this.createSmoothedSignal();
    }

    changeK(k: number) {
        this.k = k;
        this.createSmoothedSignal();
    }

    get showK(): boolean {
        return "func" in this.smoothingAlgorithms[this.algoNumber];
    }

    private fromTo(i: number, k: number, func: (from: number, to: number) => number): number {
        const delta = (k - 1) >> 1;
        const from = i < delta ? 0 : i - delta;
        const to = i + delta;

        return func(from, to);
    }

    private smoothOnSum(k: number, m: number, c: number[]): SmoothFunction {
        const delta = (k - 1) >> 1;

        return (i: number, get: (i: number) => number) => {
            if (i < delta) {
                return get(i);
            }

            let result = 0;

            for (let j = i - delta; j <= i + delta; j++) {
                result += c[j - i + delta] * get(j);
            }

            return result * m;
        };
    }
}

type SmoothingData = { name: string, kStep: number, func: (k: number) => SmoothFunction };
