
export type Interceptor = (i: Invocation) => any

export abstract class Invocation {
    memberName: string;
    memberType: "getter" | "method"
    parameters: IArguments;
    abstract proceed(): any;
}

export interface Builder<T> {
    addInterception(interception: Interceptor): Builder<T>
    build(): T
}
