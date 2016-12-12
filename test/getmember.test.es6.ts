import * as Benalu from "../src/benalu";
import * as Chai from "chai";

let object = {
    data: 333,
    changeData: function () { this.data = 444; }
}

function MyFunction() {
    this.data = 333;
}
MyFunction.prototype.changeData = function () { this.data = 444; }

class MyClass {
    data: number = 333;
    changeData() {
        this.data = 444;
    }
}

describe("getMember tests", () => {
    it("Should get members of javascript Object", () => {
        var members = Benalu.getMembers(object);
        Chai.expect(members.indexOf("data")).greaterThan(-1);
        Chai.expect(members.indexOf("changeData")).greaterThan(-1);
    });

    it("Should get members of javascript Function Object", () => {
        var members = Benalu.getMembers(new MyFunction());
        Chai.expect(members.indexOf("data")).greaterThan(-1);
        Chai.expect(members.indexOf("changeData")).greaterThan(-1);
    });

    it("Should get members of javascript ES6 Function Class", () => {
        var members = Benalu.getMembers(new MyClass());
        Chai.expect(members.indexOf("data")).greaterThan(-1);
        Chai.expect(members.indexOf("changeData")).greaterThan(-1);
    });

    it("Function Object should should not contains constructor info", () => {
        var members = Benalu.getMembers(new MyFunction());
        Chai.expect(members.indexOf("constructor")).eq(-1);
    });

    it("ES6 function class should should not contains constructor info", () => {
        var members = Benalu.getMembers(new MyClass());
        Chai.expect(members.indexOf("constructor")).eq(-1);
    });
})