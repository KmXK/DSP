export type ParameterChecker = (value: number) => string | null;

export interface SignalParameter {
    readonly name: string;
    value: number;
    checkRange?: ParameterChecker | ParameterChecker[];
}

export type SignalParameters = { [propertyName: string]: SignalParameter };

export abstract class Signal {
    protected abstract readonly _parameters: SignalParameters;

    normalized = false;

    private cache: Record<number, Record<number, number>> = {};

    getValues(range: { from: number, to: number }, samplingFrequency: number): { x: number, y: number }[] {
        const result: { x: number, y: number }[] = [];

        for (let x = range.from; x <= range.to; x++) {
            result.push({
                x: x,
                y: this.cachedFormula(x, samplingFrequency)
            });
        }

        if (this.normalized) {
            const min = result.reduce((p, c) => Math.min(p, c.y), Infinity);
            return result.map(c => ({ x: c.x, y: c.y - min }));
        }

        return result;
    }

    cachedFormula(n: number, N: number): number {
        if (this.cache[N]) {
            if (this.cache[N][n]) {
                return this.cache[N][n];
            }
        } else {
            this.cache[N] = {};
        }

        return this.cache[N][n] = this.formula(n, N);
    }

    public get parameters(): SignalParameters {
        return this._parameters;
    }

    public setParameter(name: string, value: any): void {
        if (!this._parameters.hasOwnProperty(name)) {
            throw new Error(`Unknown parameter: ${name}`);
        }

        this._parameters[name].value = value;
        this.clearCache();
    }

    protected clearCache(): void {
        this.cache = {};
    }

    abstract formula(n: number, N: number): number;

    protected getParameterValue(name: string, n: number, N: number): number {
        return this._parameters[name].value;
    }

    abstract clone(): Signal;

    protected copyParameters(signal: Signal): void {
        Object.entries(signal._parameters).forEach(([name, p]) => this._parameters[name].value = p.value);
    }
}
