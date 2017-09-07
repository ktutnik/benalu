export type MemberType = "Method" | "Getter" | "Setter"

export type Interceptor = (i: Invocation) => any

export abstract class Invocation {
    memberName: string;
    parameters: IArguments;
    memberType: MemberType;
    abstract proceed(): any;
}

class MethodInvocation extends Invocation {
    constructor(private original: any, public memberName: string, public parameters: IArguments) {
        super()
        this.memberType = "Method"
    }

    proceed() {
        return this.original[this.memberName].apply(this.original, this.parameters)
    }
}

class InterceptorInvocation extends Invocation {
    constructor(private next: Invocation, private interceptor: Interceptor) {
        super();
        this.memberName = next.memberName;
        this.memberType = next.memberType;
        this.parameters = next.parameters;
    }

    proceed() {
        return this.interceptor(this.next)
    }
}


export function getMembers(origin) {
    let members = Object.keys(origin);
    let properties = Object.getOwnPropertyNames(Object.getPrototypeOf(origin));
    members = members.concat(properties);
    let conIndex = members.indexOf("constructor");
    members.splice(conIndex, 1);
    return members;
}

export class BenaluBuilder<T> {
    origin: any;
    intercepts: Array<Interceptor> = [];

    constructor(origin) {
        this.origin = origin
    }

    addInterception(interception: Interceptor) {
        this.intercepts.push(interception);
        return this;
    }

    private methodInterception(origin:any, method:string, interceptors:Interceptor[]){
        return function(){
            let invocation:Invocation = new MethodInvocation(origin, method, arguments)
            interceptors.forEach(x => {
                invocation = new InterceptorInvocation(invocation, x)
            })
            return invocation.proceed();
        }
    }

    build(): T {
        let proxy = {};
        let members = getMembers(this.origin);
        for (let key of members) {
            if(typeof this.origin[key] == "function"){
                proxy[key] = this.methodInterception(this.origin, key, this.intercepts.reverse())
            }
            else {
                proxy[key] = this.origin[key]
            }
        }
        return <T>proxy;
    }
}

export function fromInstance<T>(instance: T) {
    let config = new BenaluBuilder<T>(instance);
    return config;
}



