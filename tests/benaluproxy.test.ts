import {Stub, MultipleParameters, NUMBER_RESULT, STRING_RESULT} from "./stub";
import {Benalu, BenaluBuilder, BenaluProxy, Invocation} from "../src/benalu"; 
import * as Chai from "chai";

describe("BenaluProxy", () => {
    it("Should create a perfect copy of object", () => {
        let stub = new Stub();
        
        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                i.proceed();
            })
            .build();
        let numResult = proxy.getNumber();
        let strResult = proxy.getString();
        let dataResult = proxy.getData(300)
        
        Chai.expect(numResult).eq(NUMBER_RESULT);
        Chai.expect(strResult).eq(STRING_RESULT);
        Chai.expect(dataResult).eq(300);
    });
    
    it("Should proxy method with multiple parameters", () => {
        let stub = new MultipleParameters();
        
        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => {
                i.proceed();
            })
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
});