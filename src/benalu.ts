export class Invocation {
    methodName: string;
    args: IArguments;
    returnValue: any;
    private realMethod: (methodName: string, args) => any;
    private thisArg: any;

    constructor(thisArg: any, realMethod: (methodName: string, args) => any) {
        this.realMethod = realMethod;
        this.thisArg = thisArg;
    }

    proceed() {
        this.returnValue = this.realMethod
            .call(this.thisArg, this.methodName, this.args);
    }
}

export interface IMemberProxyInfo {
    origin: any;
    memberName: string;
    interceptors: Array<(invocation: Invocation) => void>;
}

export interface IMemberProxyStrategy {
    getStrategy(info: IMemberProxyInfo);
}

export class MemberProxyStrategyFactory {
    getMemberProxy(type: string) {
        if (type == "function")
            return new MethodProxyStrategy();
        else
            return new PropertyProxyStrategy();
    }
}


export class MethodProxyStrategy implements IMemberProxyStrategy {
    getStrategy(info: IMemberProxyInfo) {
        return ((i: IMemberProxyInfo) => {
            return function() {
                if (i.interceptors.length == 0) {
                    return invokeOriginalMember(i.memberName, arguments);
                }
                else {
                    let lastResult;
                    for (let intercept of i.interceptors) {
                        let invocation = new Invocation(this, invokeOriginalMember)
                        invocation.args = arguments;
                        invocation.methodName = i.memberName;
                        intercept.call(this, invocation);
                        lastResult = invocation.returnValue;
                    }
                    return lastResult;
                }
            }

            function invokeOriginalMember(methodName: string, args) {
                return (<Function>i.origin[methodName]).apply(i.origin, args);
            }
        })(info);
    }
}

export class PropertyProxyStrategy implements IMemberProxyStrategy {
    getStrategy(info: IMemberProxyInfo) {
        return info.origin[info.memberName];
    }
}


export class BenaluBuilder<T> {
    origin: any;
    intercepts: Array<(invocation: Invocation) => void> = [];
    strategyFactory: MemberProxyStrategyFactory;

    constructor() {
        this.strategyFactory = new MemberProxyStrategyFactory();
    }

    addInterception(interception: (invocation: Invocation) => void) {
        this.intercepts.push(interception);
        return this;
    }

    build(): T {
        let proxy = new Object();
        for (let key in this.origin) {
            let strategy = this.strategyFactory.getMemberProxy(typeof this.origin[key]);
            proxy[key] = strategy.getStrategy({
                interceptors: this.intercepts,
                origin: this.origin,
                memberName: key
            });
        }
        return <T>proxy;
    }
}

export class Benalu {
    static fromInstance<T>(instance: T) {
        let config = new BenaluBuilder<T>();
        config.origin = instance;
        return config;
    }
}



