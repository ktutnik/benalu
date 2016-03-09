export declare enum MemberType {
    Method = 0,
    Getter = 1,
    Setter = 2,
}

export interface Invocation {
    memberName: string;
    parameters: IArguments;
    returnValue?: any;
    memberType: MemberType;
    proceed(): any;
}

export declare class BenaluBuilder<T> {
    private origin: any;
    private intercepts: Array<(invocation: Invocation) => void>;
    constructor(origin: any);
    addInterception(interception: (invocation: Invocation) => void): this;
    build(): T;
    private getStrategy(memberType);
}

export declare class Benalu {
    static fromInstance<T>(instance: T): BenaluBuilder<T>;
}
