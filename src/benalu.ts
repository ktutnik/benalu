export enum MemberType {
    Method, Getter, Setter
}

export interface Invocation {
    memberName: string;
    parameters: IArguments;
    returnValue?: any;
    memberType: MemberType;
    proceed();
}

export interface InterceptionInfo {
    memberName: string;
    interceptors: Array<(invocation: Invocation) => void>;
}

export interface MemberProxyStrategyInfo{
    origin:any;
    memberName:string;
    interceptors: Array<(invocation: Invocation) => void>;
}

export interface MemberProxyStrategy {
    apply(proxy, info: MemberProxyStrategyInfo)
}

export class Interception {
    info:InterceptionInfo;
    constructor(info:InterceptionInfo){
        this.info = info;
    }
    
    invoke(memberType:MemberType, originMemberInvoker: (parameters) => any,
        parameters?:IArguments) {
        if (this.info.interceptors.length == 0) {
            return originMemberInvoker(parameters);
        }
        else {
            let returnValue;
            for (let interceptor of this.info.interceptors) {
                let invocation: Invocation = {
                    parameters: parameters,
                    memberType: memberType,
                    memberName: this.info.memberName,
                    proceed: function() {
                        this.returnValue =
                            originMemberInvoker(parameters)
                    }
                };
                interceptor(invocation);
                returnValue = invocation.returnValue;
            }
            return returnValue;
        }
    }
}

export class MethodProxyStrategy implements MemberProxyStrategy {
    apply(proxy, info: MemberProxyStrategyInfo) {
        proxy[info.memberName] = ((info: MemberProxyStrategyInfo) => {
            return function() {
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
                return function() {
                    var interception = new Interception(info);
                    return interception.invoke(MemberType.Getter, (parameters) => {
                        return info.origin[info.memberName];
                    });
                }
            })(info),
            set: ((info: MemberProxyStrategyInfo) => {
                return function() {
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

    build(): T {
        let proxy = new Object();
        for (let key in this.origin) {
            var memberType = typeof this.origin[key];
            var strategy = this.getStrategy(memberType);
            strategy.apply(proxy, {
                memberName: key,
                origin: this.origin,
                interceptors: this.intercepts
            });
        }
        return <T>proxy;
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

export function fromInstance<T>(instance:T){
    let config = new BenaluBuilder<T>(instance);
        return config;
}



