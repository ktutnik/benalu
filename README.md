#Benalu
[![Build Status](https://travis-ci.org/ktutnik/benalu.svg?branch=master)](https://travis-ci.org/ktutnik/benalu)

A dynamic proxy for javascript. 
Provide a light weight [proxy class](https://en.wikipedia.org/wiki/Proxy_pattern)
generator with multiple interception.

###About
The purpose of Benalu is provide a simple way to do a simple AOP in javascript. 
Benalu also useful for IOC container library that hasn't support for interception
like [Inversify 1.x](http://inversify.io)

###Features


###How To Use It
Using benalu is very simple. You start building your proxy by using `Benalu` builder

```Javascript
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

2. `args` arguments passed to the invoked method. Usefull when you want to get 
information of the arguments passed to the method.

3. `proceed()` method to proceed current invocation. This method will invoke the 
method of the real object.

4. `returnValue` return value of the current invoked method. this member filled automatically after the `proceed()` method called. You can override the return value of current invocation by suplying a value to the `returnValue` member

###Interception Priority
Interception can be applied more than one in a proxy. The last inserted interceptor 
having the most priority. If the last interceptor change the return value of Invocation 
then all previous override will be ignored.

#License
The MIT License (MIT)

Copyright (c) 2016 ktutnik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
