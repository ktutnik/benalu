import { Interceptor, Invocation, Builder } from "./core"
import { InterceptorInvocation, MethodInvocation, GetterInvocation } from "./invocations"

export class BenaluBuilder<T extends object> implements Builder<T>{
    origin: T;
    intercepts: Array<Interceptor> = [];

    constructor(origin: T) {
        this.origin = origin
    }

    addInterception(interception: Interceptor) {
        this.intercepts.push(interception);
        return this;
    }



    build(): T {
        return new Proxy(this.origin, ((origin, interceptors: Interceptor[]) => {
            return {
                get: function (target, propKey, receiver) {
                    var propValue = target[propKey];
                    if (typeof propValue != "function") {
                        let invocation: Invocation = new GetterInvocation(propValue, propKey.toString())
                        interceptors.forEach(x => {
                            invocation = new InterceptorInvocation(invocation, x)
                        })
                        return invocation.proceed();
                    }
                    else {
                        return function () {
                            let invocation: Invocation = new MethodInvocation(origin, propKey.toString(), arguments)
                            interceptors.forEach(x => {
                                invocation = new InterceptorInvocation(invocation, x)
                            })
                            return invocation.proceed();
                        }
                    }
                }
            }
        })(this.origin, this.intercepts.reverse()));
    }
}