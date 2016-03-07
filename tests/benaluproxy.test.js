"use strict";
var benalu_1 = require("../src/benalu");
var Chai = require("chai");
var NUMBER_RESULT = 999;
var NEW_PROPERTY_RESULT = 8888;
var STRING_RESULT = "THIS IS STRING_RESULT";
var Stub = (function () {
    function Stub() {
        this.property = NUMBER_RESULT;
    }
    Stub.prototype.getNumber = function () {
        return NUMBER_RESULT;
    };
    Stub.prototype.getString = function () {
        return STRING_RESULT;
    };
    Stub.prototype.getData = function (data) {
        return data;
    };
    Stub.prototype.substract = function (a, b) {
        return a - b;
    };
    Stub.prototype.changeProperty = function () {
        this.property = NEW_PROPERTY_RESULT;
    };
    return Stub;
}());
describe("BenaluProxy", function () {
    it("Should create a perfect copy of prototype function", function () {
        var stub = new Stub();
        var proxy = benalu_1.Benalu.fromInstance(stub)
            .build();
        var numResult = proxy.getNumber();
        var strResult = proxy.getString();
        var dataResult = proxy.getData(300);
        Chai.expect(numResult).eq(NUMBER_RESULT);
        Chai.expect(strResult).eq(STRING_RESULT);
        Chai.expect(dataResult).eq(300);
    });
    it("Should create perfect copy of object", function () {
        var object = {
            data: "THIS IS DATA",
            getData: function () {
                return 300;
            }
        };
        var proxy = benalu_1.Benalu.fromInstance(object)
            .build();
        var numResult = proxy.getData();
        Chai.expect(numResult).eq(300);
        Chai.expect(proxy.data).eq("THIS IS DATA");
    });
    it("Should proxy method with multiple parameters", function () {
        var stub = new Stub();
        var proxy = benalu_1.Benalu.fromInstance(stub)
            .build();
        var result = proxy.substract(9, 2);
        Chai.expect(result).eq(7);
    });
    it("Should be able to change return value from interception", function () {
        var stub = new Stub();
        var proxy = benalu_1.Benalu.fromInstance(stub)
            .addInterception(function (i) {
            i.proceed();
            i.returnValue = 999;
        })
            .build();
        var numResult = proxy.getNumber();
        Chai.expect(numResult).eq(999);
    });
    it("Should be able to use multiple interception", function () {
        var stub = new Stub();
        var proxy = benalu_1.Benalu.fromInstance(stub)
            .addInterception(function (i) {
            i.returnValue = 999;
        })
            .addInterception(function (i) {
            i.returnValue = 444;
        })
            .build();
        var numResult = proxy.getNumber();
        Chai.expect(numResult).eq(444);
    });
    it("Should be able to intercept a getter", function () {
        var original = {
            data: 30
        };
        var memberType;
        var proxy = benalu_1.Benalu.fromInstance(original)
            .addInterception(function (i) {
            i.returnValue = 999;
            memberType = i.memberType;
        })
            .build();
        var numResult = proxy.data;
        Chai.expect(numResult).eq(999);
        Chai.expect(memberType).eq(benalu_1.MemberType.Getter);
    });
    it("Should be able to intercept a setter", function () {
        var original = {
            data: 30
        };
        var memberType;
        var proxy = benalu_1.Benalu.fromInstance(original)
            .addInterception(function (i) {
            memberType = i.memberType;
        })
            .build();
        proxy.data = 200;
        Chai.expect(memberType).eq(benalu_1.MemberType.Setter);
    });
    it("Should reflect original property change when original property internally changed", function () {
        var original = {
            data: 30,
            changeData: function () {
                this.data = 999;
            }
        };
        var memberType;
        var proxy = benalu_1.Benalu.fromInstance(original)
            .build();
        proxy.changeData();
        Chai.expect(proxy.data).eq(999);
    });
});
//# sourceMappingURL=benaluproxy.test.js.map