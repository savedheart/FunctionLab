import { isFunctionName, mathFunctions } from '../constants/mathFunctions.ts'
import type { ValidationFailure } from './validateExpression.ts'

const FUNCTION_ALIASES: Readonly<Record<string, string>> = {
    tg: 'tan',
    ctg: 'cot',
    arctg: 'atan',
    arcctg: 'acot',
    lg: 'log',
    sh: 'sinh',
    ch: 'cosh',
    th: 'tanh',
    cth: 'coth',
}

const KNOWN_FUNCTIONS = [
    ...Object.keys(mathFunctions),
    ...Object.keys(FUNCTION_ALIASES),
].sort((a, b) => b.length - a.length)

function extractParameterName(source: string): string {
    const match = /^\s*[a-zA-Z_][a-zA-Z_0-9]*\s*\(\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*\)\s*=/.exec(source)
    return match ? match[1] : 'x'
}

export function formatValidationError(failure: ValidationFailure, source: string): string {
    const pos = failure.position + 1
    const before = source.slice(0, failure.position).trimEnd()
    const after = source.slice(failure.position)
    const paramName = extractParameterName(source)

    if (failure.error.startsWith('Unexpected character ')) {
        const char = source[failure.position] ?? ''
        if (char === ',') {
            return /\d,\d/.test(source)
                ? 'Use a dot "." instead of "," for decimals (e.g. 0.5).'
                : 'Commas are not supported — enter a single-variable expression.'
        }
        if (char === '|') {
            return `Use abs(${paramName}) instead of "|${paramName}|" for absolute value.`
        }
        if (char === '[' || char === ']' || char === '{' || char === '}') {
            return 'Use round parentheses "( )" for grouping.'
        }
        return `Unsupported symbol "${char}" at position ${pos}.`
    }

    if (failure.error.startsWith('Number is out of range!')) {
        return `Number at position ${pos} is too large to evaluate.`
    }

    const missingParenAfterFn = /^Expected "\(" after "([^"]+)"/.exec(failure.error)
    if (missingParenAfterFn) {
        const fn = missingParenAfterFn[1]
        return `Wrap the argument of "${fn}" in parentheses, e.g. ${fn}(${paramName}).`
    }

    const unclosedParen = /^Expected "\)" to close "\(" at position (\d+)/.exec(failure.error)
    if (unclosedParen) {
        const openPos = Number(unclosedParen[1]) + 1
        return `Missing closing ")" for "(" opened at position ${openPos}.`
    }

    if (failure.error.startsWith('Unexpected ")"')) {
        if (before.endsWith('(')) {
            const fnMatch = /([a-zA-Z_][a-zA-Z_0-9]*)\s*\($/.exec(before)
            if (fnMatch) {
                const fn = fnMatch[1].toLowerCase()
                return `Enter an argument inside ${fn}( ), e.g. ${fn}(${paramName}).`
            }
            return 'Empty parentheses "( )" — enter an expression inside.'
        }
        return `Extra ")" at position ${pos} without a matching "(".`
    }

    if (failure.error.startsWith('Expected an expression')) {
        if (before.endsWith('=')) {
            return `Enter an expression after "=", e.g. f(${paramName}) = ${paramName}^2.`
        }
        if (/[+\-*/^−×÷]$/.test(before)) {
            return `Incomplete expression — add a value after "${before.at(-1)}".`
        }
        if (before.endsWith('(')) {
            return 'Incomplete expression inside parentheses — add a value and ")".'
        }
        return `Incomplete expression at position ${pos}.`
    }

    const unexpectedOp = /^Unexpected operator "([^"]+)"/.exec(failure.error)
    if (unexpectedOp) {
        const op = unexpectedOp[1]
        if (op === '=') {
            return /^\s*x\s*=/.test(source)
                ? 'Equations like "x = 5" are not functions of x. Use "y = …" or "f(x) = …".'
                : `Unexpected "=" at position ${pos}. Write "y = …" or "f(x) = …" at the start.`
        }
        if (op === '<' || op === '>' || op === '<=' || op === '>=') {
            return `Inequalities ("${op}") are not supported — enter a function expression.`
        }
        if (op === '^' && source[failure.position - 1] === '^') {
            return `Invalid "^^" — use a single "^" for powers, e.g. ${paramName}^2.`
        }
        if (!before || before.endsWith('(') || before.endsWith('=')) {
            return `Operator "${op}" needs a number or variable before it.`
        }
        if (/[+\-*/^−×÷]$/.test(before)) {
            return `Two operators in a row near position ${pos} — remove the extra "${op}".`
        }
        return `Unexpected operator "${op}" at position ${pos}.`
    }

    if (failure.error.startsWith('Unexpected token; expected an operator or end of input')) {
        if (after.startsWith(')')) {
            return `Extra ")" at position ${pos} without a matching "(".`
        }

        if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(before.trimStart()) && /^\(\s*\)\s*=/.test(after)) {
            return `Specify a variable inside parentheses, e.g. ${before.trim()}(x) = x^2.`
        }

        if (after.startsWith('(')) {
            const identMatch = /([a-zA-Z_][a-zA-Z_0-9]*)$/.exec(before)
            if (identMatch) {
                const ident = identMatch[1]
                const lower = ident.toLowerCase()
                if (ident === paramName || ident === 'pi' || ident === 'e') {
                    return `Missing "*" operator — write ${ident}*(…) for multiplication.`
                }
                if (Object.hasOwn(FUNCTION_ALIASES, lower)) {
                    return `Unknown function "${ident}" — use ${FUNCTION_ALIASES[lower]}(${paramName}) instead.`
                }
                return `Unknown function "${ident}(…)". Try sin, cos, tan, cot, sqrt, ln, log, or abs.`
            }
            return `Missing "*" before "(" — write explicit multiplication, e.g. 2*(${paramName} + 1).`
        }

        if (/\d$/.test(before) && /^\d/.test(after)) {
            return `Missing operator between numbers at position ${pos}.`
        }

        const numBefore = /(\d+(?:\.\d+)?)$/.exec(before)
        const wordAfter = /^([a-zA-Z_][a-zA-Z_0-9]*)/.exec(after)
        if (numBefore && wordAfter) {
            const num = numBefore[1]
            const word = wordAfter[1]
            const suffix = isFunctionName(word.toLowerCase()) ? `(${paramName})` : ''
            return `Missing "*" operator — write ${num}*${word}${suffix} instead of ${num}${word}${suffix}.`
        }

        return `Missing "*" operator at position ${pos} — write explicit multiplication (e.g. 2*${paramName}).`
    }

    const unknownIdent = /^Unknown identifier "([^"]+)"/.exec(failure.error)
    if (unknownIdent) {
        const ident = unknownIdent[1]
        const lower = ident.toLowerCase()

        if (lower === 'pi') {
            return `Write constant "pi" in lowercase instead of "${ident}".`
        }
        if (ident === 'E') {
            return 'Write Euler\'s constant "e" in lowercase instead of "E".'
        }
        if (lower === paramName.toLowerCase() && ident !== paramName) {
            return `Variable name is case-sensitive — use "${paramName}" instead of "${ident}".`
        }
        if (ident === 'y' && /^\s*y\s*=/.test(source)) {
            return `Right side cannot reference "y" — write the formula using "${paramName}".`
        }
        if (Object.hasOwn(FUNCTION_ALIASES, lower)) {
            return `Unknown "${ident}" — use ${FUNCTION_ALIASES[lower]}(${paramName}) with parentheses.`
        }

        for (const fn of KNOWN_FUNCTIONS) {
            if (lower.startsWith(fn) && ident.length > fn.length) {
                const rest = ident.slice(fn.length)
                const canonical = Object.hasOwn(FUNCTION_ALIASES, fn) ? FUNCTION_ALIASES[fn] : fn
                return `Missing parentheses — write ${canonical}(${rest}) instead of "${ident}".`
            }
        }

        return `Unknown symbol "${ident}" at position ${pos}. Use variable "${paramName}" or constants pi, e.`
    }

    if (failure.error === 'This expression has no finite real value.') {
        if (/\/(?!=)/.test(source)) {
            return 'Undefined for all real numbers (division by zero).'
        }
        if (/\bsqrt\s*\(/i.test(source)) {
            return 'Undefined for all real numbers (sqrt requires a value ≥ 0).'
        }
        if (/\b(ln|log)\s*\(/i.test(source)) {
            return 'Undefined for all real numbers (logarithm requires a value > 0).'
        }
        if (/\b(asin|acos|arcsin|arccos)\s*\(/i.test(source)) {
            return 'Undefined for all real numbers (inverse sin/cos input must be in [-1, 1]).'
        }
        return 'Expression has no finite real values to plot.'
    }

    return failure.error.replace(/at position (\d+)/g, (_, p) => `at position ${Number(p) + 1}`)
}
