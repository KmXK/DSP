import { Signal, SignalParameters } from '@app/models/signal';

export class ModulatedSignal extends Signal {
    override readonly _parameters: SignalParameters = {
    };

    nativeSignal: Signal;
    modulationSignal: Signal;
    modulationParameter: string;

    constructor(
        nativeSignal: Signal,
        modulationSignal: Signal,
        modulationParameter: string
    ) {
        super();

        this.nativeSignal = nativeSignal.clone();
        this.modulationSignal = modulationSignal.clone();
        this.modulationParameter = modulationParameter;

        this.modulationSignal.normalized = true;

        // @ts-ignore
        this.nativeSignal.getParameterValue = function(name, n, N): number {
            if (name === modulationParameter) {
                return (modulationSignal.cachedFormula(n, N) + 1) * this.parameters[name].value;
            }

            return this.parameters[name].value;
        }
    }

    formula(n: number, N: number): number {
        return this.nativeSignal.cachedFormula(n, N);
    }

    override clone(): Signal {
        return new ModulatedSignal(this.nativeSignal, this.modulationSignal, this.modulationParameter);
    }
}
