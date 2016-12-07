"use strict";
var benalu_1 = require("../src/benalu");
var Chai = require("chai");
var STRING_RESULT = "THIS IS STRING_RESULT";
var PROPERTY_VALUE = 30;
var OTHER_PROPERTY_VALUE = 444;
var Stub = (function () {
    function Stub() {
        this.property = PROPERTY_VALUE;
    }
    Stub.prototype.getString = function () {
        return STRING_RESULT;
    };
    Stub.prototype.changeProperty = function () {
        this.property = OTHER_PROPERTY_VALUE;
    };
    return Stub;
}());
describe("Strategy", function () {
    describe("MethodProxyStrategy", function () {
        it("Should wrap method to object instance properly", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.MethodProxyStrategy();
            strategy.apply(obj, {
                interceptor: null,
                origin: stub,
                memberName: "getString",
            });
            var result = obj.getString();
            Chai.expect(result).eq(STRING_RESULT);
        });
        it("Should able to do interception properly", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.MethodProxyStrategy();
            strategy.apply(obj, {
                interceptor: function (i) {
                    i.proceed();
                    i.returnValue = "DIFFERENT_STRING_RESULT";
                },
                origin: stub,
                memberName: "getString",
            });
            var result = obj.getString();
            Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
        });
    });
    describe("PropertyProxyStrategy", function () {
        it("Should wrap property to object instance properly", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptor: null,
                origin: stub,
                memberName: "property",
            });
            var result = obj.property;
            Chai.expect(result).eq(PROPERTY_VALUE);
        });
        it("Should able to store data like normal property", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptor: null,
                origin: stub,
                memberName: "property",
            });
            obj.property = 333;
            Chai.expect(obj.property).eq(333);
            Chai.expect(stub.property).eq(333);
        });
        it("Should change when original property changed internally", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptor: null,
                origin: stub,
                memberName: "property",
            });
            stub.changeProperty();
            Chai.expect(obj.property).eq(OTHER_PROPERTY_VALUE);
            Chai.expect(stub.property).eq(OTHER_PROPERTY_VALUE);
        });
        it("Should able to change value from interceptor", function () {
            var stub = new Stub();
            var obj = new Object();
            var strategy = new benalu_1.PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptor: function (i) {
                    i.returnValue = OTHER_PROPERTY_VALUE;
                },
                origin: stub,
                memberName: "property",
            });
            Chai.expect(obj.property).eq(OTHER_PROPERTY_VALUE);
        });
    });
});
//# sourceMappingURL=strategy.test.js.map