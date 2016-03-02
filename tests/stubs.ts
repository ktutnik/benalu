export const NUMBER_RESULT = 999;
export const STRING_RESULT = "THIS IS STRING_RESULT";

export class Stub{
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

export class MultipleParameters{
    substract(a:number, b:number){
        return a - b;
    }
}
