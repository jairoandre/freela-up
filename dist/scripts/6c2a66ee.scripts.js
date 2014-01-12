"use strict";angular.module("zupPainelApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"MainCtrl"}).when("/groups",{templateUrl:"views/groups/index.html",controller:"GroupCtrl"}).when("/groups/add",{templateUrl:"views/groups/add.html",controller:"GroupCtrl"}).when("/groups/:id",{templateUrl:"views/groups/list.html",controller:"GroupCtrl"}).when("/users",{templateUrl:"views/users/index.html",controller:"UsersCtrl"}).when("/users/add",{templateUrl:"views/users/add.html",controller:"UsersCtrl"}).when("/reports",{templateUrl:"views/reports/index.html",controller:"ReportsCtrl"}).when("/reports/:id",{templateUrl:"views/reports/list.html",controller:"ReportsCtrl"}).when("/reports/:id/:id",{templateUrl:"views/reports/view.html",controller:"ReportsCtrl"}).when("/inventories",{templateUrl:"views/inventories/index.html",controller:"InventoriesCtrl"}).when("/items",{templateUrl:"views/items/index.html",controller:"ItemsCtrl"}).when("/items/search",{templateUrl:"views/items/search.html",controller:"ItemsCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("zupPainelApp").controller("MainCtrl",function(){}),angular.module("zupPainelApp").controller("GroupCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").controller("UsersCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").controller("ReportsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").controller("InventoriesCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").controller("ItemsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").directive("bootstrapSwitch",function(){return{link:function(a,b){b.bootstrapSwitch(),console.log("a")}}});