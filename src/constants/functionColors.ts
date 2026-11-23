export const functionColors = {
    red: '#FF5252',
    coral: '#FF7F6E',
    orange: '#FF9635',
    yellow: '#FFE45C',
    green: '#B6FF2E',
    teal: '#20C997',
    cyan: '#39DCEB',
    blue: '#4D9FFF',
    purple: '#A970FF',
    pink: '#FF69B4',
} as const;

export type FunctionColor = keyof typeof functionColors;
export const functionColorNames = Object.keys(functionColors) as FunctionColor[];