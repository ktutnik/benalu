import {Stub, NUMBER_RESULT, STRING_RESULT} from "./stub";
import {Benalu, BenaluBuilder, BenaluProxy, Invocation} from "../src/benalu"; 
import * as Chai from "chai";

describe("BenaluProxy", () => {
    it("Should create a perfect copy of object", (done) => {
        var stub = new Stub();
        
        var proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                i.proceed();
            })
            .build();
        var numResult = proxy.getNumber();
        var strResult = proxy.getString();
        
        Chai.expect(numResult).eq(NUMBER_RESULT);
        Chai.expect(strResult).eq(STRING_RESULT);
    });
});