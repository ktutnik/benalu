import {Stub, MultipleParameters, NUMBER_RESULT, STRING_RESULT} from "./stubs";
import {Benalu, BenaluBuilder, BenaluProxy, Invocation} from "../src/benalu";
import * as Chai from "chai";

describe("BenaluProxy", () => {
    it("Should create a perfect copy of prototype function", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .build();
        let numResult = proxy.getNumber();
        let strResult = proxy.getString();
        let dataResult = proxy.getData(300)

        Chai.expect(numResult).eq(NUMBER_RESULT);
        Chai.expect(strResult).eq(STRING_RESULT);
        Chai.expect(dataResult).eq(300);
    });

    it("Should create perfect copy of object", () => {
        var object = {
            data: "THIS IS DATA",
            getData: function() {
                return 300;
            }
        }
        let proxy = Benalu.fromInstance(object)
            .build();
        let numResult = proxy.getData();

        Chai.expect(numResult).eq(300);
        Chai.expect(proxy.data).eq("THIS IS DATA");
    });

    it("Should proxy method with multiple parameters", () => {
        let stub = new MultipleParameters();

        let proxy = Benalu.fromInstance(stub)
            .build();

        let result = proxy.substract(9, 2);

        Chai.expect(result).eq(7);
    });

    it("Should be able to change return value from interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                i.proceed();
                i.returnValue = 999;
            })
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(999);
    });

    it("Should be able to use multiple interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                i.proceed();
                i.returnValue = 999;
            })
            .addInterception((i) => {
                i.returnValue = 444;
            })
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(444);
    });

    it("Should provide correct information about invocation", () => {
        let stub = new MultipleParameters();

        let methodName;
        let args: any[];
        let returnValue;

        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                methodName = i.methodName;
                args = i.args;
                i.proceed();
                returnValue = i.returnValue;
            })
            .build();
        let numResult = proxy.substract(20, 10);

        Chai.expect(methodName).eq("substract");
        Chai.expect(args[0]).eq(20);
        Chai.expect(args[1]).eq(10);
        Chai.expect(returnValue).eq(10);
    })
});