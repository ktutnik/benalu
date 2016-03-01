export class Invocation{
    methodName:string;
    args: any[];
    returnValue:any;
    private realMethod: (methodName:string, args) => any;
    private thisArg:any;
    
    constructor(thisArg:any, realMethod:(methodName:string, args) => any){
        this.realMethod = realMethod;
        this.thisArg = thisArg;
    }
    
    proceed(){
        this.returnValue = this.realMethod
            .call(this.thisArg, this.methodName, this.args);
    }
}

export class BenaluBuilder <T> {
    origin:any;
    intercepts: Array<(invocation:Invocation) => void> = []
    addInterception(interception:(invocation:Invocation) => void){
        this.intercepts.push(interception);
        return this;
    }
    build(): T{
        let proxy = new BenaluProxy(this.origin, this.intercepts);
        return <T><any> proxy;
    }
}

export class Benalu {
    static fromInstance<T>(instance:T){
        let config = new BenaluBuilder<T>();
        config.origin = instance;
        return config;
    }
}

export class BenaluProxy{
    origin:any;
    interceptors: Array<(invoication:Invocation) => void>;
    constructor(origin, interceptors:Array<(invocation:Invocation) => void>){
        this.origin = origin;
        this.interceptors = interceptors;
        for(let methodName in this.origin){
            this[methodName] = ((name) => {
                return function() {
                    return this.__proxy_invoke(name, arguments)
                }
            })(methodName);
        }
    }

    __proxy_invoke(methodName:string, args){
        let lastResult;
        for(let intercept of this.interceptors){
            let invocation = new Invocation(this, this.__proxy_invokeOriginalMethod)
            invocation.args = args;
            invocation.methodName = methodName;
            intercept.call(this, invocation);
            lastResult = invocation.returnValue;
        }
        return lastResult;
    }
    
    __proxy_invokeOriginalMethod(methodName:string, args){
        return (<Function>this.origin[methodName]).apply(this.origin, args);
    }
}

//export {Benalu, BenaluBuilder, BenaluProxy, Invocation};

