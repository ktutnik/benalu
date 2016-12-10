import {Interception, InterceptionInfo, Invocation, MemberType} from "../src/benalu";
import * as Chai from "chai";

const STRING_RESULT = "THIS IS STRING_RESULT";

class Stub {

    getString() {
        return STRING_RESULT;
    }

    substract(a: number, b: number) {
        return a - b;
    }
}

describe("Interception", () => {
    it("Should invoke method properly", () => {
        var stub = new Stub();

        var interception = new Interception({
            memberName: "getString",
            interceptor: null
        });

        var result = interception.invoke(MemberType.Method, (args) => {
            return stub.getString();
        });

        Chai.expect(result).eq(STRING_RESULT);
    });

    it("Should invoke method with multiple parameters", () => {
        var stub = new Stub();

        var interception = new Interception({
            memberName: "substract",
            interceptor: null
        });

        var result = interception.invoke(MemberType.Method, (args) => {
            return stub.substract(args[0], args[1]);
        }, { callee: null, length: 2, [0]: 20, [1]: 10 });

        Chai.expect(result).eq(10);
    });

    it("Should pass invocation info properly in interceptor", () => {
        var stub = new Stub();

        let methodName;
        let args;
        let returnValue;
        let methodType;

        var interception = new Interception({
            memberName: "substract",
            interceptor: (i) => {
                i.proceed();
                methodName = i.memberName;
                args = i.parameters;
                returnValue = i.returnValue;
                methodType = i.memberType;
            }
        });

        var result = interception.invoke(MemberType.Method, (args) => {
            return stub.substract(args[0], args[1]);
        }, { callee: null, length: 2, [0]: 20, [1]: 10 });

        Chai.expect(result).eq(10);
        Chai.expect(args.length).eq(2);
        Chai.expect(methodName).eq("substract");
        Chai.expect(returnValue).eq(10);
        Chai.expect(methodType).eq(MemberType.Method);
    });

    it("Should invoke method properly, if no interceptor provided", () => {
        var stub = new Stub();

        var interception = new Interception({
            memberName: "getString",
            interceptor: null
        });

        let isCalled = false;
        var result = interception.invoke(MemberType.Method, (args) => {
            isCalled = true;
            return stub.getString();
        });

        Chai.expect(result).eq(STRING_RESULT);
        Chai.expect(isCalled).eq(true);
    });

    it("Should be able to change return value from interception", () => {
        var stub = new Stub();

        var interception = new Interception({
            memberName: "getString",
            interceptor: (i) => {
                i.proceed();
                i.returnValue = "DIFFERENT_STRING_RESULT"
            }
        });

        var result = interception.invoke(MemberType.Method, (args) => {
            return stub.getString();
        });

        Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
    });

    it("Should be able to change return value from interception, even if proceed not called", () => {
        var stub = new Stub();

        var interception = new Interception({
            memberName: "getString",
            interceptor: (i) => {
                i.returnValue = "DIFFERENT_STRING_RESULT"
            }
        });

        let isCalled = false;
        var result = interception.invoke(MemberType.Method, (args) => {
            isCalled = true;
            return stub.getString();
        });

        Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
        Chai.expect(isCalled).eq(false);
    });
});