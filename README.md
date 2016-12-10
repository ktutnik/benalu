#Benalu

[![Build Status](https://travis-ci.org/ktutnik/benalu.svg?branch=master)](https://travis-ci.org/ktutnik/benalu)
[![Known Vulnerabilities](https://snyk.io/test/github/ktutnik/benalu/61a461a5c488644682af5dee54e926d6ea3fe9af/badge.svg)](https://snyk.io/test/github/ktutnik/benalu/61a461a5c488644682af5dee54e926d6ea3fe9af)
[![codecov](https://codecov.io/gh/ktutnik/benalu/branch/master/graph/badge.svg)](https://codecov.io/gh/ktutnik/benalu)

A dynamic proxy for javascript. 
Provide a light weight [proxy class](https://en.wikipedia.org/wiki/Proxy_pattern)
generator with multiple interception.

###About
The purpose of Benalu is provide a simple way to do a simple AOP in javascript. 
Benalu also useful for IOC container library that hasn't support for interception

###Features
1. Can proxy a Function prototype or an object.

2. Can proxy method & property 

3. Can add multiple interceptions

###Installation
```
npm install benalu
```

###How To Use It
Using benalu is very simple. You start building your proxy by using `Benalu` builder

```Javascript
var Benalu = require('benalu');

//declare the class
function MyObject(){}
MyObject.prototype.getNumber = function(){
    return 700;
}

//create instance
var myObject = new MyObject();
     
//make a proxy   
var proxy = Benalu.fromInstance(myObject)
    .addInterception(function(i) {
        //filter the invocation
        if(i.methodName == "getNumber"){
            //call the real method
            i.proceed();
            //override the return value
            i.returnValue = 300;
        }
    })
    .build();
    
var numResult = proxy.getNumber();
//numResult become 300 vs 700
```

###Interception & Invocation
Interception in Benalu simply a callback function with single parameter of `Invocation`.
Invocation consist of 3 important members:

1. `methodName` name of current invoked method. Usefull when you only want to intercept 
specific method of the class

2. `parameters` arguments passed to the invoked method. Usefull when you want to get 
information of the arguments passed to the method.

3. `proceed()` method to proceed current invocation. This method will invoke the 
method of the real object.

4. `returnValue` return value of the current invoked method. this member filled 
automatically after the `proceed()` method called. You can override the return value 
of current invocation by suplying a value to the `returnValue` member

###Multiple Interception
Benalu also support multiple interception. 

```Javascript
var Benalu = require('benalu');

function MyObject(){}
MyObject.prototype.getNumber = function(){
    console.log("The real method called");
    return 700;
}

var myObject = new MyObject();
     
var proxy = Benalu.fromInstance(myObject)
    .addInterception(function(i) {
        if(i.methodName == "getNumber"){
            console.log("First interceptor before proceed");
            i.proceed();
            console.log("First interceptor after proceed");
            i.returnValue = 300;
        }
    })
    .addInterception(function(i) {
        if(i.methodName == "getNumber"){
            console.log("Second interceptor before proceed");
            i.proceed();
            console.log("Second interceptor after proceed");
            i.returnValue = i.returnValue + 300;
        }
    })
    .build();
    
var numResult = proxy.getNumber();
//numResult = 600
```

Above code will write log in the console like below:

```
Second interceptor before proceed
First interceptor before proceed
The real method called
First interceptor after proceed
Second interceptor after proceed
```
