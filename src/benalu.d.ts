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
export interface InterceptionInfo {
    memberName: string;
    interceptors: Array<(invocation: Invocation) => void>;
}
export interface MemberProxyStrategyInfo {
    origin: any;
    memberName: string;
    interceptors: Array<(invocation: Invocation) => void>;
}
export interface MemberProxyStrategy {
    apply(proxy: any, info: MemberProxyStrategyInfo): any;
}
export declare class Interception {
    info: InterceptionInfo;
    constructor(info: InterceptionInfo);
    invoke(memberType: MemberType, originMemberInvoker: (parameters) => any, parameters?: IArguments): any;
}
export declare class MethodProxyStrategy implements MemberProxyStrategy {
    apply(proxy: any, info: MemberProxyStrategyInfo): void;
}
export declare class PropertyProxyStrategy implements MemberProxyStrategy {
    apply(proxy: any, info: MemberProxyStrategyInfo): void;
}
export declare class BenaluBuilder<T> {
    origin: any;
    intercepts: Array<(invocation: Invocation) => void>;
    constructor(origin: any);
    addInterception(interception: (invocation: Invocation) => void): this;
    build(): T;
    private getStrategy(memberType);
}
export declare function fromInstance<T>(instance: T): BenaluBuilder<T>;
