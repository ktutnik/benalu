
import { BenaluBuilder } from "./benalu-builder"

export function fromInstance<T extends object>(instance: T) {
    return new BenaluBuilder<T>(instance);
}

export { Invocation, Builder, Interceptor } from "./core"



