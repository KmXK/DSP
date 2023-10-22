export type ParameterChecker = (value: number) => string | null;

export interface SignalParameter {
    readonly name: string;
    value: number;
    checkRange?: ParameterChecker | ParameterChecker[];
}

export type SignalParameters = { [propertyName: string]: SignalParameter };

export abstract class Signal {
    abstract readonly parameters: SignalParameters;

    normalized = false;

    getValues(range: { from: number, to: number }, samplingFrequency: number): { x: number, y: number }[] {
        const result: { x: number, y: number }[] = [];

        for (let x = range.from; x <= range.to; x++) {
            result.push({
                x: x,
                y: this.formula(x, samplingFrequency)
            });
        }

        if (this.normalized) {
            const min = result.reduce((p, c) => Math.min(p, c.y), Infinity);
            return result.map(c => ({ x: c.x, y: c.y - min }));
        }

        return result;
    }

    abstract formula(n: number, N: number): number;

    protected getParameterValue(name: string, n: number, N: number): number {
        return this.parameters[name].value;
    }

    abstract clone(): Signal;

    protected copyParameters(signal: Signal): void {
        Object.entries(signal.parameters).forEach(([name, p]) => this.parameters[name].value = p.value);
    }
}
