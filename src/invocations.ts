import {Invocation, Interceptor} from "./core"

export class MethodInvocation extends Invocation {
    constructor(private original: any, public memberName: string, public parameters: IArguments) {
        super()
        this.memberType = "method"
    }

    proceed() {
        return this.original[this.memberName].apply(this.original, this.parameters)
    }
}

export class GetterInvocation extends Invocation {
    constructor(private value: any, public memberName: string) {
        super()
        this.memberType = "getter"
    }

    proceed() {
        return this.value;
    }
}

export class InterceptorInvocation extends Invocation {
    constructor(private next: Invocation, private interceptor: Interceptor) {
        super();
        this.memberName = next.memberName;
        this.parameters = next.parameters;
        this.memberType = next.memberType
    }

    proceed() {
        return this.interceptor(this.next)
    }
}
