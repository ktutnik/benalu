"use strict";
(function (MemberType) {
    MemberType[MemberType["Method"] = 0] = "Method";
    MemberType[MemberType["Getter"] = 1] = "Getter";
    MemberType[MemberType["Setter"] = 2] = "Setter";
})(exports.MemberType || (exports.MemberType = {}));
var MemberType = exports.MemberType;
var Interception = (function () {
    function Interception(info) {
        this.info = info;
    }
    Interception.prototype.invoke = function (memberType, originMemberInvoker, parameters) {
        if (!this.info.interceptor) {
            return originMemberInvoker(parameters);
        }
        else {
            var invocation = {
                parameters: parameters,
                memberType: memberType,
                memberName: this.info.memberName,
                proceed: function () {
                    this.returnValue =
                        originMemberInvoker(parameters);
                }
            };
            this.info.interceptor(invocation);
            return invocation.returnValue;
        }
    };
    return Interception;
}());
exports.Interception = Interception;
var MethodProxyStrategy = (function () {
    function MethodProxyStrategy() {
    }
    MethodProxyStrategy.prototype.apply = function (proxy, info) {
        proxy[info.memberName] = (function (info) {
            return function () {
                var interception = new Interception(info);
                return interception.invoke(MemberType.Method, function (parameters) {
                    return info.origin[info.memberName].apply(info.origin, parameters);
                }, arguments);
            };
        })(info);
    };
    return MethodProxyStrategy;
}());
exports.MethodProxyStrategy = MethodProxyStrategy;
var PropertyProxyStrategy = (function () {
    function PropertyProxyStrategy() {
    }
    PropertyProxyStrategy.prototype.apply = function (proxy, info) {
        Object.defineProperty(proxy, info.memberName, {
            enumerable: true,
            get: (function (info) {
                return function () {
                    var interception = new Interception(info);
                    return interception.invoke(MemberType.Getter, function (parameters) {
                        return info.origin[info.memberName];
                    });
                };
            })(info),
            set: (function (info) {
                return function () {
                    var interception = new Interception(info);
                    return interception.invoke(MemberType.Setter, function (parameters) {
                        info.origin[info.memberName] = parameters[0];
                    }, arguments);
                };
            })(info)
        });
    };
    return PropertyProxyStrategy;
}());
exports.PropertyProxyStrategy = PropertyProxyStrategy;
var BenaluBuilder = (function () {
    function BenaluBuilder(origin) {
        this.intercepts = [];
        this.origin = origin;
    }
    BenaluBuilder.prototype.addInterception = function (interception) {
        this.intercepts.push(interception);
        return this;
    };
    BenaluBuilder.prototype.createProxy = function (origin, interceptor) {
        var proxy = new Object();
        for (var key in origin) {
            var memberType = typeof origin[key];
            var strategy = this.getStrategy(memberType);
            strategy.apply(proxy, {
                memberName: key,
                origin: origin,
                interceptor: interceptor
            });
        }
        return proxy;
    };
    BenaluBuilder.prototype.build = function () {
        var originObject = this.origin;
        for (var _i = 0, _a = this.intercepts; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            originObject = this.createProxy(originObject, interceptor);
        }
        return originObject;
    };
    BenaluBuilder.prototype.getStrategy = function (memberType) {
        if (memberType == "function") {
            return new MethodProxyStrategy();
        }
        else {
            return new PropertyProxyStrategy();
        }
    };
    return BenaluBuilder;
}());
exports.BenaluBuilder = BenaluBuilder;
function fromInstance(instance) {
    var config = new BenaluBuilder(instance);
    return config;
}
exports.fromInstance = fromInstance;
