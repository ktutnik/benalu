#Benalu

[![Build Status](https://travis-ci.org/ktutnik/benalu.svg?branch=master)](https://travis-ci.org/ktutnik/benalu)
[![Known Vulnerabilities](https://snyk.io/test/github/ktutnik/benalu/61a461a5c488644682af5dee54e926d6ea3fe9af/badge.svg)](https://snyk.io/test/github/ktutnik/benalu/61a461a5c488644682af5dee54e926d6ea3fe9af)
[![Test Coverage](https://codeclimate.com/github/ktutnik/benalu/badges/coverage.svg)](https://codeclimate.com/github/ktutnik/benalu/coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/ktutnik/benalu.svg)](https://greenkeeper.io/)

Better ES6 Proxy API for interception

Tired of complicated [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) class API to do simple interception? Benalu is your friend

## About
The purpose of Benalu is provide a simple API to do interception in JavaScript. 
Benalu also useful for IOC container library that hasn't support for interception


## Installation
```
npm install benalu
```

## How To Use It
Using benalu is very simple. You start building your proxy by using `Benalu` builder

```javascript
var Benalu = require('benalu');

//declare the class
class MyObject(){
    getNumber() {
        return 700;
    }
}

//create instance
var myObject = new MyObject();
     
//make a proxy   
var proxy = Benalu.fromInstance(myObject)
    .addInterception(function(i) {
        //filter the invocation
        if(i.memberName == "getNumber"){
            //call the real method
            let result = i.proceed();
            //return different value
            return 300;
        }
    })
    .build();
    
var numResult = proxy.getNumber();
//numResult become 300 vs 700
```

## Interception & Invocation
Interception in Benalu simply a callback function with single parameter of `Invocation`.
Invocation consist of 3 important members:

1. `memberName` name of current invoked method or getter. Usefull when you only want to intercept specific method or getter of the class

2. `memberType` type of currently invoked member the vlaue could be`method` or `getter`

3. `parameters` arguments passed to the invoked method. Usefull when you want to get 
information of the arguments passed to the method.

4. `proceed()` method to proceed current invocation. This method will invoke the 
method of the real object.


## Multiple Interception
Benalu also support multiple interception. 

```javascript
var Benalu = require('benalu');

class MyObject(){
    getNumber() {
        console.log("The real method called")
        return 700;
    }
}

var myObject = new MyObject();
     
var proxy = Benalu.fromInstance(myObject)
    .addInterception(function(i) {
        if(i.methodName == "getNumber"){
            console.log("First interceptor before proceed");
            let result = i.proceed();
            console.log("First interceptor after proceed");
            return result + 300
        }
    })
    .addInterception(function(i) {
        if(i.methodName == "getNumber"){
            console.log("Second interceptor before proceed");
            let result = i.proceed();
            console.log("Second interceptor after proceed");
            return 300
        }
    })
    .build();
    
var numResult = proxy.getNumber();
//numResult = 600
```

Above code will write log in the console like below:

```
First interceptor before proceed
Second interceptor before proceed
The real method called
Second interceptor after proceed
First interceptor after proceed
```
