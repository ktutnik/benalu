const NUMBER_RESULT = 999;
const STRING_RESULT = "THIS IS STRING_RESULT";

class Stub{
    getNumber(){
        return NUMBER_RESULT;
    }
    
    getString(){
        return STRING_RESULT;
    }
}

export {Stub, NUMBER_RESULT, STRING_RESULT}