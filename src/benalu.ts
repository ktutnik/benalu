export enum MemberType {
    Method, Getter, Setter
}

export interface Invocation {
    memberName: string;
    parameters: IArguments;
    returnValue?: any;
    memberType: MemberType;
    proceed(): void;
}

export interface InterceptionInfo {
    memberName: string;
    interceptor: (invocation: Invocation) => void;
}

export interface MemberProxyStrategyInfo {
    origin: any;
    memberName: string;
    interceptor: (invocation: Invocation) => void;
}

export interface MemberProxyStrategy {
    apply(proxy, info: MemberProxyStrategyInfo)
}

export function getMembers(origin) {
    let members = Object.keys(origin);
    let properties = Object.getOwnPropertyNames(Object.getPrototypeOf(origin));
    members = members.concat(properties);
    let conIndex = members.indexOf("constructor");
    members.splice(conIndex, 1);
    return members;
}

export class Interception {
    info: InterceptionInfo;
    constructor(info: InterceptionInfo) {
        this.info = info;
    }

    invoke(memberType: MemberType, originMemberInvoker: (parameters) => any,
        parameters?: any) {
        if (!this.info.interceptor) {
            return originMemberInvoker(parameters);
        }
        else {
            let invocation: Invocation = {
                parameters: parameters,
                memberType: memberType,
                memberName: this.info.memberName,
                proceed: function () {
                    this.returnValue =
                        originMemberInvoker(parameters)
                }
            };
            this.info.interceptor(invocation);
            return invocation.returnValue;
        }
    }
}

export class MethodProxyStrategy implements MemberProxyStrategy {
    apply(proxy, info: MemberProxyStrategyInfo) {
        proxy[info.memberName] = ((info: MemberProxyStrategyInfo) => {
            return function () {
                var interception = new Interception(info);
                return interception.invoke(MemberType.Method, (parameters) => {
                    return (<Function>info.origin[info.memberName]).apply(info.origin, parameters);
                }, arguments)
            }
        })(info);
    }
}

export class PropertyProxyStrategy implements MemberProxyStrategy {
    apply(proxy, info: MemberProxyStrategyInfo) {
        Object.defineProperty(proxy, info.memberName, {
            enumerable: true,
            get: ((info: MemberProxyStrategyInfo) => {
                return function () {
                    var interception = new Interception(info);
                    return interception.invoke(MemberType.Getter, (parameters) => {
                        return info.origin[info.memberName];
                    });
                }
            })(info),
            set: ((info: MemberProxyStrategyInfo) => {
                return function () {
                    var interception = new Interception(info);
                    return interception.invoke(MemberType.Setter, (parameters) => {
                        info.origin[info.memberName] = parameters[0];
                    }, arguments);
                }
            })(info)
        })
    }
}

export class BenaluBuilder<T> {
    origin: any;
    intercepts: Array<(invocation: Invocation) => void> = [];

    constructor(origin) {
        this.origin = origin
    }

    addInterception(interception: (invocation: Invocation) => void) {
        this.intercepts.push(interception);
        return this;
    }

    private createProxy(origin: any, interceptor: (invocation: Invocation) => void): T {
        let proxy = {};
        let members = getMembers(origin);
        for (let key of members) {
            var memberType = typeof origin[key];
            var strategy = this.getStrategy(memberType);
            strategy.apply(proxy, {
                memberName: key,
                origin: origin,
                interceptor: interceptor
            });
        }
        return <T>proxy;
    }

    build(): T {
        let originObject = this.origin;
        for (let interceptor of this.intercepts) {
            originObject = this.createProxy(originObject, interceptor);
        }
        return <T>originObject;
    }

    private getStrategy(memberType: string): MemberProxyStrategy {
        if (memberType == "function") {
            return new MethodProxyStrategy()
        }
        else {
            return new PropertyProxyStrategy();
        }
    }
}

export function fromInstance<T>(instance: T) {
    let config = new BenaluBuilder<T>(instance);
    return config;
}



