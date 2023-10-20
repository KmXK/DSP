import { ValidatorFn } from '@angular/forms';

import { SignalParameter } from '@app/models/signal';

export const SignalParameterValidator: (s: SignalParameter) => ValidatorFn =
    signalParameter => {
        return control => {
            if (!signalParameter.checkRange) {
                return null;
            }

            const checkers = typeof (signalParameter.checkRange) === 'function'
                ? [signalParameter.checkRange]
                : signalParameter.checkRange;

            const error = checkers.find(c => c(control.value));

            if (error) {
                return {
                    SignalParameterValidator: error
                };
            }

            return null;
        }
    }
