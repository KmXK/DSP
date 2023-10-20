export const minValueChecker = (minValue: number, include: boolean) => {
    return function (value: number) {
        if (minValue > value || (minValue === value && include)) {
            return 'Value must be greater than ' + (include ? 'or equal to ' : '') + minValue;
        }

        return value < minValue ? `Value must be greater than ${ minValue }` : null
    }
};
