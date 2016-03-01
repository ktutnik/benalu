declare const NUMBER_RESULT: number;
declare const STRING_RESULT: string;
declare class Stub {
    getNumber(): number;
    getString(): string;
    getData(data: any): any;
}
declare class MultipleParameters {
    substract(a: number, b: number): number;
}
export { Stub, MultipleParameters, NUMBER_RESULT, STRING_RESULT };
