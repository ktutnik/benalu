
import * as Benalu from "../src/benalu";
import * as Chai from "chai";

const NUMBER_RESULT = 999;
const NEW_PROPERTY_RESULT = 8888;
const STRING_RESULT = "THIS IS STRING_RESULT";

class Stub {
    property = NUMBER_RESULT;

    getNumber() {
        return NUMBER_RESULT;
    }

    getString() {
        return STRING_RESULT;
    }

    getData(data) {
        return data;
    }

    substract(a: number, b: number) {
        return a - b;
    }

    changeProperty() {
        this.property = NEW_PROPERTY_RESULT;
    }
}


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
            getData: function () {
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
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .build();

        let result = proxy.substract(9, 2);

        Chai.expect(result).eq(7);
    });

    it("Should be able to change return value from interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => 999)
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(999);
    });

    it("Should be able to use multiple interception", () => {
        let stub = new Stub();

        let proxy = Benalu.fromInstance(stub)
            .addInterception((i) => i.proceed() + 1)
            .addInterception((i) => 1)
            .build();
        let numResult = proxy.getNumber();

        Chai.expect(numResult).eq(2);
    });

    /*it("Should be able to intercept a getter", () => {
        let original = {
            data: 30
        };

        let memberType;
        let proxy = Benalu.fromInstance(original)
            .addInterception((i) => 999)
            .build();
        let numResult = proxy.data;

        Chai.expect(numResult).eq(999);
        Chai.expect(memberType).eq(Benalu.MemberType.Getter);
    });

    it("Should be able to intercept a setter", () => {
        let original = {
            data: 30
        };

        let memberType;
        let proxy = Benalu.fromInstance(original)
            .addInterception((i) => {
                memberType = i.memberType;
            })
            .build();
        proxy.data = 200;

        Chai.expect(memberType).eq(Benalu.MemberType.Setter);
    });
    
    it("Should reflect original property change when original property internally changed", () => {
        let original = {
            data: 30,
            changeData: function () {
                this.data = 999;
            }
        };

        let memberType;
        let proxy = Benalu.fromInstance(original)
            .build();
        proxy.changeData();

        Chai.expect(proxy.data).eq(999);
    });*/
});