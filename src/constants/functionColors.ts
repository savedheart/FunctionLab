export const functionColors = {
    green: '#B6FF2E',
    cyan: '#39DCEB',
    purple: '#A970FF',
    red: '#FF5252',
    orange: '#FF9635',
    pink: '#FF69B4',
    blue: '#4D9FFF',
    yellow: '#FFE45C',
    teal: '#20C997',
    magenta: '#E754E8',
    lime: '#80FF72',
    coral: '#FF7F6E',
    indigo: '#7C83FF',
    gold: '#FFC247',
    violet: '#C084FC',
} as const;

export type FunctionColor = keyof typeof functionColors;
export const functionColorNames = Object.keys(functionColors) as FunctionColor[];