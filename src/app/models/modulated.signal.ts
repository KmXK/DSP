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

        const native = nativeSignal.clone();
        const mod = modulationSignal.clone();
        mod.normalized = true;

        this.nativeSignal = native;
        this.modulationSignal = mod;
        this.modulationParameter = modulationParameter;

        // @ts-ignore
        this.nativeSignal.getParameterValue = function(name, n, N): number {
            if (name === modulationParameter) {
                return mod.cachedFormula(n, N);
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
