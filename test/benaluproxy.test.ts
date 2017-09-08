
import * as Benalu from "../src/benalu";
import * as Chai from "chai";

class Stub {
    myProp:number = 100;

    getNumber(){
        return 100;
    }

    withPar(a, b, c){
        return [a, b, c]
    }
}

describe("BenaluProxy", () => {

    it("Should not error when no interceptor provided", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(100);
    });

    it("Should able to intercept method properly", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => i.proceed())
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(100);
    });

    it("Should give correct information about intercepted method", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => {
                Chai.expect(i.memberName).eq("withPar")
                Chai.expect(i.memberType).eq("method")
                Chai.expect(i.parameters[0]).eq(1)
                Chai.expect(i.parameters[1]).eq(2)
                Chai.expect(i.parameters[2]).eq(3)
                return i.proceed()
            })
            .build();
        let numResult = proxy.withPar(1,2,3);

        Chai.expect(numResult).deep.eq([1, 2, 3])
    });

    it("Should able to intercept getter properly", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => i.proceed())
            .build();
        let numResult = proxy.myProp;

        Chai.expect(numResult).eq(100);
    });

    it("Should give correct information about intercepted getter", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => {
                Chai.expect(i.memberName).eq("myProp")
                Chai.expect(i.memberType).eq("getter")
                Chai.expect(i.parameters).undefined
                return i.proceed()
            })
            .build();
        let numResult = proxy.myProp

        Chai.expect(numResult).deep.eq(100)
    });

    it("Should be able to change return value from interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => 999)
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(999);
    });

    it("Should be able to use multiple interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => i.proceed() + 1)
            .addInterception(i => 1)
            .build();

        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(2);
    });

    it("Should execute first interceptor first", () => {
        let stub = new Stub();
        let order = []

        let proxy = Benalu.fromInstance(stub)
            .addInterception(i => {
                order.push(1)
                return i.proceed()
            })
            .addInterception(i => {
                order.push(2)
                return i.proceed()
            })
            .addInterception(i => {
                order.push(3)
                return i.proceed()
            })
            .build();

        let numResult = proxy.getNumber();

        Chai.expect(order).deep.eq([1, 2, 3])
        Chai.expect(numResult).eq(100);
    });

});