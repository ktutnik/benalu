export class Invocation {
    methodName: string;
    args: any[];
    returnValue: any;
    private info:InvocationInfo

    constructor(info:InvocationInfo) {
        this.info = info;
    }

    proceed() {
        this.returnValue = this.info.invoke(this.args);
    }
}

export class InvocationInfo {
    origin: any;
    memberName: string;
    invoke(args){
        return this.origin[this.memberName]
            .apply(this.origin, args)
    }
}

export class InvocationManager {
    info: InvocationInfo;
    interceptors: Array<(invocation: Invocation) => void>;
    
    constructor(info: InvocationInfo, interceptors: Array<(invocation: Invocation) => void>) {
        this.info = info;
        this.interceptors = interceptors;
    }

    private invoke(args) {
        if (this.interceptors.length == 0) {
            return this.info.invoke(args);
        }
        else {
            let lastResult;
            for (let intercept of this.interceptors) {
                let invocation = new Invocation(this.info)
                invocation.args = args;
                invocation.methodName = this.info.memberName;
                intercept.call(this, invocation);
                lastResult = invocation.returnValue;
            }
            return lastResult;
        }
    }
    
    invokeMethod(args){
        return this.invoke(args);
    }
    
    invokeProperty(args){
        return this.info.origin[this.info.memberName];
    }
}


export interface IMemberProxyStrategy {
    getStrategy(info: InvocationInfo, interceptors: Array<(invocation: Invocation) => void>);
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
    getStrategy(info: InvocationInfo, interceptors: Array<(invocation: Invocation) => void>) {
        return ((i: InvocationInfo) => {
            return function() {
                var im = new InvocationManager(i, interceptors)
                return im.invokeMethod(arguments);
            }
        })(info);
    }
}

export class PropertyProxyStrategy implements IMemberProxyStrategy {
    getStrategy(info: InvocationInfo, interceptors: Array<(invocation: Invocation) => void>) {
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
            var info = new InvocationInfo();
            info.memberName = key;
            info.origin = this.origin;
            proxy[key] = strategy.getStrategy(info, this.intercepts);
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



