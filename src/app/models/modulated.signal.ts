import { Signal, SignalParameters } from '@app/models/signal';

export class ModulatedSignal extends Signal {
    override readonly parameters: SignalParameters = {
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

        console.log(this.nativeSignal.parameters);

        // @ts-ignore
        this.nativeSignal.getParameterValue = function(name, n, N): number {
            if (name === modulationParameter) {
                if (name === 'phi') {
                    return modulationSignal.formula(n, N);
                }

                console.log(`${name}(${n}, ${N}) = ${(modulationSignal.formula(n, N)) * this.parameters[name].value}`);
                return (modulationSignal.formula(n, N) + 1) * this.parameters[name].value;
            }

            return this.parameters[name].value;
        }
    }

    formula(n: number, N: number): number {
        return this.nativeSignal.formula(n, N);
    }

    override clone(): Signal {
        return new ModulatedSignal(this.nativeSignal, this.modulationSignal, this.modulationParameter);
    }
}
