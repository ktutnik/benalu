const NUMBER_RESULT = 999;
const STRING_RESULT = "THIS IS STRING_RESULT";

class Stub{
    getNumber(){
        return NUMBER_RESULT;
    }
    
    getString(){
        return STRING_RESULT;
    }
    
    getData(data){
        return data;
    }
}

class MultipleParameters{
    substract(a:number, b:number){
        return a - b;
    }
}

export {Stub, MultipleParameters, NUMBER_RESULT, STRING_RESULT}