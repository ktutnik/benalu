"use strict";
var benalu_1 = require("../src/benalu");
var Chai = require("chai");
var STRING_RESULT = "THIS IS STRING_RESULT";
var Stub = (function () {
    function Stub() {
    }
    Stub.prototype.getString = function () {
        return STRING_RESULT;
    };
    Stub.prototype.substract = function (a, b) {
        return a - b;
    };
    return Stub;
}());
describe("Interception", function () {
    it("Should invoke method properly", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: []
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.getString();
        });
        Chai.expect(result).eq(STRING_RESULT);
    });
    it("Should invoke method with multiple parameters", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "substract",
            interceptors: []
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.substract(args[0], args[1]);
        }, (_a = { callee: null, length: 2 }, _a[0] = 20, _a[1] = 10, _a));
        Chai.expect(result).eq(10);
        var _a;
    });
    it("Should pass invocation info properly in interceptor", function () {
        var stub = new Stub();
        var methodName;
        var args;
        var returnValue;
        var methodType;
        var interception = new benalu_1.Interception({
            memberName: "substract",
            interceptors: [function (i) {
                    i.proceed();
                    methodName = i.memberName;
                    args = i.parameters;
                    returnValue = i.returnValue;
                    methodType = i.memberType;
                }]
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.substract(args[0], args[1]);
        }, (_a = { callee: null, length: 2 }, _a[0] = 20, _a[1] = 10, _a));
        Chai.expect(result).eq(10);
        Chai.expect(args.length).eq(2);
        Chai.expect(methodName).eq("substract");
        Chai.expect(returnValue).eq(10);
        Chai.expect(methodType).eq(benalu_1.MemberType.Method);
        var _a;
    });
    it("Should invoke method properly, if no interceptor provided", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: []
        });
        var isCalled = false;
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            isCalled = true;
            return stub.getString();
        });
        Chai.expect(result).eq(STRING_RESULT);
        Chai.expect(isCalled).eq(true);
    });
    it("Should be able to change return value from interception", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: [function (i) {
                    i.proceed();
                    i.returnValue = "DIFFERENT_STRING_RESULT";
                }]
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.getString();
        });
        Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
    });
    it("Should be able to change return value from interception, even if proceed not called", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: [function (i) {
                    i.returnValue = "DIFFERENT_STRING_RESULT";
                }]
        });
        var isCalled = false;
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            isCalled = true;
            return stub.getString();
        });
        Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
        Chai.expect(isCalled).eq(false);
    });
    it("Should call all interceptors on multiple interceptors", function () {
        var stub = new Stub();
        var isFirstCalled = false;
        var isSecondCalled = false;
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: [function (i) {
                    isFirstCalled = true;
                },
                function (i) {
                    isSecondCalled = true;
                }]
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.getString();
        });
        Chai.expect(isFirstCalled).eq(true);
        Chai.expect(isSecondCalled).eq(true);
    });
    it("Should return last returnValue on multiple interceptors", function () {
        var stub = new Stub();
        var interception = new benalu_1.Interception({
            memberName: "getString",
            interceptors: [function (i) {
                    i.returnValue = "DIFFERENT_STRING_RESULT";
                },
                function (i) {
                    i.returnValue = "OTHER_DIFFERENT_STRING_RESULT";
                }]
        });
        var result = interception.invoke(benalu_1.MemberType.Method, function (args) {
            return stub.getString();
        });
        Chai.expect(result).eq("OTHER_DIFFERENT_STRING_RESULT");
    });
});
