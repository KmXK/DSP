import { Component, OnInit } from '@angular/core';
import { Signal } from '@app/models/signal';
import { SmoothedSignal, SmoothFunction } from '@app/models/smoothed.signal';

@Component({
    selector: 'app-smoothing-action',
    templateUrl: './smoothing-action.component.html',
    styleUrls: ['./smoothing-action.component.scss']
})
export class SmoothingActionComponent implements OnInit {
    signal: Signal | undefined = undefined;
    smoothedSignal: Signal | undefined = undefined;
    algoNumber!: number;
    k: number = 1;
    kStep: number | undefined = undefined
    n: number = 128;

    smoothingAlgorithms: SmoothingData[] = [
        {
            name: 'Арифметическое усреднение',
            kStep: 2,
            func: k => (i, get) => this.fromTo(i, k, (from, to) => {
                let result = 0;
                for (let j = from; j <= to; j++) {
                    result += get(j);
                }
                return result / (to - from + 1);
            })
        },
        {
            name: 'Медианная фильтрация',
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
        {
            name: 'Сглаживание параболой 2 степени по 5 точкам',
            func: () => this.smoothOnSum(5, 1 / 35, [-3, 12, 17, 12, -3])
        },
        {
            name: 'Сглаживание параболой 2 степени по 7 точкам',
            func: () => this.smoothOnSum(7, 1 / 21, [-2, 3, 6, 7, 6, 3, -2])
        },
        {
            name: 'Сглаживание параболой 2 степени по 9 точкам',
            func: () => this.smoothOnSum(9, 1 / 231, [-21, 14, 39, 54, 59, 54, 39, 14, -21])
        },
        {
            name: 'Сглаживание параболой 2 степени по 11 точкам',
            func: () => this.smoothOnSum(11, 1 / 429, [-36, 9, 44, 69, 84, 89, 84, 69, 44, 9, -36])
        },
        {
            name: 'Сглаживание параболой 4 степени по 7 точкам',
            func: () => this.smoothOnSum(7, 1 / 231, [5, -30, 75, 131, 75, -30, 5])
        },
        {
            name: 'Сглаживание параболой 4 степени по 9 точкам',
            func: () => this.smoothOnSum(9, 1 / 429, [15, -55, 30, 135, 179, 135, 30, -55, 15])
        },
        {
            name: 'Сглаживание параболой 4 степени по 11 точкам',
            func: () => this.smoothOnSum(11, 1 / 429, [18, -45, -10, 60, 120, 143, 120, 60, -10, -45, 18])
        },
        {
            name: 'Сглаживание параболой 4 степени по 13 точкам',
            func: () => this.smoothOnSum(13, 1 / 2431, [110, -198, -135, 110, 390, 600, 677, 600, 390, 110, -135, -198, 110])
        },
        {
            name: 'Сглаживание Спенсера',
            func: () => this.smoothOnSum(15, 1 / 320, [-3, -6, -5, 3, 21, 46, 67, 74, 67, 46, 21, 3, -5, -6, -3])
        }
    ];

    ngOnInit(): void {
        this.algoNumber = 0;
        this.kStep = this.smoothingAlgorithms[this.algoNumber].kStep;
        this.k = 1;
    }

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

type SmoothingData = { name: string, kStep?: number, func: (k: number) => SmoothFunction };
