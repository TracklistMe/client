"use strict";angular.module("tracklistmeApp",["ngAnimate","ui.router","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","satellizer"]).config(["$stateProvider","$urlRouterProvider","$authProvider",function(a,b,c){a.state("main",{url:"/",templateUrl:"views/main.html"}).state("login",{url:"/login",templateUrl:"partials/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"views/signup.html",controller:"SignupCtrl"}).state("logout",{url:"/logout",template:null,controller:"LogoutCtrl"}).state("profile",{url:"/profile",templateUrl:"partials/profile.html",controller:"ProfileCtrl",resolve:{authenticated:["$location","$auth",function(a,b){return b.isAuthenticated()?void 0:a.path("/login")}]}}),b.otherwise("/"),c.twitter({url:"/auth/twitter"})}]),angular.module("tracklistmeApp").controller("MainCtrl",["$scope",function(a){}]),angular.module("tracklistmeApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("tracklistmeApp").controller("AdminCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("tracklistmeApp").directive("passwordStrength",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){var e=b.children(),f=Array.prototype.slice.call(e.children()),g=f.slice(-1)[0],h=f.slice(-2),i=f.slice(-3),j=f.slice(-4);b.after(e),b.bind("keyup",function(){var a,b={positive:{},negative:{}},c={positive:{},negative:{}},e=0;angular.forEach(f,function(a){a.style.backgroundColor="#ebeef1"}),d.$viewValue&&(b.positive.lower=d.$viewValue.match(/[a-z]/g),b.positive.upper=d.$viewValue.match(/[A-Z]/g),b.positive.numbers=d.$viewValue.match(/\d/g),b.positive.symbols=d.$viewValue.match(/[$-/:-?{-~!^_`\[\]]/g),b.positive.middleNumber=d.$viewValue.slice(1,-1).match(/\d/g),b.positive.middleSymbol=d.$viewValue.slice(1,-1).match(/[$-/:-?{-~!^_`\[\]]/g),c.positive.lower=b.positive.lower?b.positive.lower.length:0,c.positive.upper=b.positive.upper?b.positive.upper.length:0,c.positive.numbers=b.positive.numbers?b.positive.numbers.length:0,c.positive.symbols=b.positive.symbols?b.positive.symbols.length:0,c.positive.numChars=d.$viewValue.length,a+=c.positive.numChars>=8?1:0,c.positive.requirements=a>=3?a:0,c.positive.middleNumber=b.positive.middleNumber?b.positive.middleNumber.length:0,c.positive.middleSymbol=b.positive.middleSymbol?b.positive.middleSymbol.length:0,b.negative.consecLower=d.$viewValue.match(/(?=([a-z]{2}))/g),b.negative.consecUpper=d.$viewValue.match(/(?=([A-Z]{2}))/g),b.negative.consecNumbers=d.$viewValue.match(/(?=(\d{2}))/g),b.negative.onlyNumbers=d.$viewValue.match(/^[0-9]*$/g),b.negative.onlyLetters=d.$viewValue.match(/^([a-z]|[A-Z])*$/g),c.negative.consecLower=b.negative.consecLower?b.negative.consecLower.length:0,c.negative.consecUpper=b.negative.consecUpper?b.negative.consecUpper.length:0,c.negative.consecNumbers=b.negative.consecNumbers?b.negative.consecNumbers.length:0,e+=4*c.positive.numChars,c.positive.upper&&(e+=2*(c.positive.numChars-c.positive.upper)),c.positive.lower&&(e+=2*(c.positive.numChars-c.positive.lower)),(c.positive.upper||c.positive.lower)&&(e+=4*c.positive.numbers),e+=6*c.positive.symbols,e+=2*(c.positive.middleSymbol+c.positive.middleNumber),e+=2*c.positive.requirements,e-=2*c.negative.consecLower,e-=2*c.negative.consecUpper,e-=2*c.negative.consecNumbers,b.negative.onlyNumbers&&(e-=c.positive.numChars),b.negative.onlyLetters&&(e-=c.positive.numChars),e=Math.max(0,Math.min(100,Math.round(e))),e>85?angular.forEach(j,function(a){a.style.backgroundColor="#008cdd"}):e>65?angular.forEach(i,function(a){a.style.backgroundColor="#6ead09"}):e>30?angular.forEach(h,function(a){a.style.backgroundColor="#e09115"}):g.style.backgroundColor="#e01414")})},template:'<span class="password-strength-indicator"><span></span><span></span><span></span><span></span></span>'}}),angular.module("tracklistmeApp").controller("NavbarCtrl",["$scope","$auth",function(a,b){a.isAuthenticated=function(){return b.isAuthenticated()}}]),angular.module("tracklistmeApp").controller("SignupCtrl",["$scope","$alert","$auth",function(a,b,c){a.signup=function(){c.signup({displayName:a.displayName,email:a.email,password:a.password})["catch"](function(a){b({content:a.data.message,animation:"fadeZoomFadeDown",type:"material",duration:3})})}}]);