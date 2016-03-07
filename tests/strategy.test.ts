import {MethodProxyStrategy, PropertyProxyStrategy} from "../src/benalu";
import * as Chai from "chai";

const STRING_RESULT = "THIS IS STRING_RESULT";
const PROPERTY_VALUE = 30;
const OTHER_PROPERTY_VALUE = 444;

class Stub {
    property = PROPERTY_VALUE;
    getString() {
        return STRING_RESULT;
    }
    
    changeProperty(){
        this.property = OTHER_PROPERTY_VALUE;
    }
}


describe("Strategy", () => {
    describe("MethodProxyStrategy", () => {
        it("Should wrap method to object instance properly", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new MethodProxyStrategy();
            strategy.apply(obj, {
                interceptors: [],
                origin: stub,
                memberName: "getString",
            });
            var result = obj.getString();
            Chai.expect(result).eq(STRING_RESULT);
        });
        
        it("Should able to do interception properly", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new MethodProxyStrategy();
            strategy.apply(obj, {
                interceptors: [(i) => {
                    i.proceed();
                    i.returnValue = "DIFFERENT_STRING_RESULT"
                }],
                origin: stub,
                memberName: "getString",
            });
            var result = obj.getString();
            Chai.expect(result).eq("DIFFERENT_STRING_RESULT");
        });
    });
    
    describe("PropertyProxyStrategy", () => {
        it("Should wrap property to object instance properly", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptors: [],
                origin: stub,
                memberName: "property",
            });
            var result = obj.property;
            Chai.expect(result).eq(PROPERTY_VALUE);
        });
        
        it("Should able to store data like normal property", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptors: [],
                origin: stub,
                memberName: "property",
            });
            obj.property = 333;
            Chai.expect(obj.property).eq(333);
            Chai.expect(stub.property).eq(333);
        });
        
        it("Should change when original property changed internally", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptors: [],
                origin: stub,
                memberName: "property",
            });
            stub.changeProperty();
            Chai.expect(obj.property).eq(OTHER_PROPERTY_VALUE);
            Chai.expect(stub.property).eq(OTHER_PROPERTY_VALUE);
        });
        
        it("Should able to change value from interceptor", () => {
            var stub = new Stub();
            var obj:any = new Object();
            var strategy = new PropertyProxyStrategy();
            strategy.apply(obj, {
                interceptors: [(i) => {
                    i.returnValue = OTHER_PROPERTY_VALUE;
                }],
                origin: stub,
                memberName: "property",
            });
            Chai.expect(obj.property).eq(OTHER_PROPERTY_VALUE);
        });
    })
})