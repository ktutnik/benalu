export class Invocation {
    methodName: string;
    args: any[];
    returnValue: any;
    private info:InterceptionInfo

    constructor(info:InterceptionInfo) {
        this.info = info;
    }

    proceed() {
        this.returnValue = this.info.invoke(this.args);
    }
}

export class InterceptionInfo {
    origin: any;
    memberName: string;
    interceptors: Array<(invocation: Invocation) => void>;
    invoke(args){
        return this.origin[this.memberName]
            .apply(this.origin, args)
    }
}

export class InterceptionManager {
    info: InterceptionInfo;
    
    constructor(info: InterceptionInfo) {
        this.info = info;
    }

    getResult(args) {
        if (this.info.interceptors.length == 0) {
            return this.info.invoke(args);
        }
        else {
            let lastResult;
            for (let intercept of this.info.interceptors) {
                let invocation = new Invocation(this.info)
                invocation.args = args;
                invocation.methodName = this.info.memberName;
                intercept.call(this, invocation);
                lastResult = invocation.returnValue;
            }
            return lastResult;
        }
    }
}

export interface IMemberProxyStrategy {
    apply(proxy, info:InterceptionInfo);
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
    apply(proxy, info:InterceptionInfo){
        proxy[info.memberName] = ((info: InterceptionInfo) => {
            return function() {
                var im = new InterceptionManager(info)
                return im.getResult(arguments);
            }
        })(info);
    }
}

export class PropertyProxyStrategy implements IMemberProxyStrategy {
    apply(proxy, info:InterceptionInfo){
        proxy[info.memberName] = info.origin[info.memberName];
    }
}


export class BenaluBuilder<T> {
    origin: any;
    intercepts: Array<(invocation: Invocation) => void> = [];
    strategyFactory: MemberProxyStrategyFactory;

    constructor(origin) {
        this.origin = origin
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
            var info = new InterceptionInfo();
            info.memberName = key;
            info.origin = this.origin;
            info.interceptors = this.intercepts
            strategy.apply(proxy, info);
        }
        return <T>proxy;
    }
}

export class Benalu {
    static fromInstance<T>(instance: T) {
        let config = new BenaluBuilder<T>(instance);
        return config;
    }
}



