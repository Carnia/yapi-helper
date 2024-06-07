
import { Interpreter } from 'eval5';
import { transform } from '@babel/standalone';

const interpreter = new Interpreter(window);
/**
 * 通过eval5解释器执行代码段，返回值是代码段最后一个表达式的返回值
 * @param code ES6代码，如"const getMessage=()=>'Hello World';console.log(getMessage());"
 * @returns 
 */
export const evaluate = (code: string) => {
    //@ts-ignore
    const ES5Code= transform(code, { presets: ["env"] }).code
    const res = interpreter.evaluate(ES5Code);
    return res;
};

/**
 * 通过eval5解释器执行代码段，返回值是代码段最后一个表达式的返回值
 * @param code ES6代码，如"const getMessage=()=>'Hello World';console.log(getMessage());"
 * @returns 
 */
export const evaluate_hard = (code: string) => {
    //@ts-ignore
    const ES5Code= transform(code, { presets: ["env"] }).code
    const res =  new Interpreter(window).evaluate(ES5Code);
    return res;
};
