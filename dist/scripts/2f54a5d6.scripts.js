"use strict";angular.module("zupPainelApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap"]).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/login.html",controller:"MainCtrl"}).when("/groups",{templateUrl:"views/groups/index.html",controller:"GroupsCtrl",access:{logged:!0}}).when("/groups/add",{templateUrl:"views/groups/add.html",controller:"GroupsCtrl",access:{logged:!0}}).when("/groups/:id",{templateUrl:"views/groups/list.html",controller:"ViewGroupsCtrl",access:{logged:!0}}).when("/users",{templateUrl:"views/users/index.html",controller:"UsersCtrl",access:{logged:!0}}).when("/users/group/:groupId",{templateUrl:"views/users/index.html",controller:"UsersCtrl",access:{logged:!0}}).when("/users/:id",{templateUrl:"views/users/view.html",controller:"ViewUsersCtrl",access:{logged:!0}}).when("/users/add",{templateUrl:"views/users/add.html",controller:"UserCtrl",access:{logged:!0}}).when("/reports",{templateUrl:"views/reports/index.html",controller:"ReportsCtrl",access:{logged:!0}}).when("/reports/:categoryId",{templateUrl:"views/reports/list.html",controller:"ViewItemsReportsCtrl",access:{logged:!0}}).when("/reports/:categoryId/:id",{templateUrl:"views/reports/view.html",controller:"ViewReportsCtrl",access:{logged:!0}}).when("/inventories",{templateUrl:"views/inventories/index.html",controller:"InventoriesCtrl",access:{logged:!0}}).when("/inventories/edit/:id",{templateUrl:"views/inventories/edit.html",controller:"InventoriesCtrl",access:{logged:!0}}).when("/items",{templateUrl:"views/items/index.html",controller:"ItemsCtrl",access:{logged:!0}}).when("/items/map",{templateUrl:"views/items/map.html",controller:"ItemsCtrl",access:{logged:!0}}).when("/items/search",{templateUrl:"views/items/search.html",controller:"ItemsCtrl",access:{logged:!0}}).when("/items/:id",{templateUrl:"views/items/view.html",controller:"ItemsCtrl",access:{logged:!0}}).when("/tags",{templateUrl:"views/tags/index.html",controller:"TagsCtrl",access:{logged:!0}}).otherwise({redirectTo:"/"}),b.interceptors.push(["$q","$injector",function(a,b){return{request:function(c){c.url=c.url.replace("{base_url}","http://staging.zup.sapience.io");var d=null;return b.invoke(["Auth",function(a){d=a.getToken()}]),c.headers["X-App-Token"]=d,c||a.when(c)},responseError:function(c){var d=c.config.expectedErrors;return("undefined"==typeof d||-1===d.indexOf(c.status))&&b.invoke(["Error",function(a){a.showDetails(c)}]),a.reject(c)}}}]),b.defaults.useXDomain=!0,delete b.defaults.headers.common["X-Requested-With"]}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$routeChangeStart",function(d,e,f){if("undefined"==typeof f&&(a.isLoading=!0),"undefined"!=typeof e.access&&e.access.logged===!0){var g=c.check();g.then(function(){a.isLoading=!1},function(){a.isLoading=!1,b.path("/")})}else a.isLoading=!1})}]),angular.module("zupPainelApp").controller("MainCtrl",["User","Error","$scope","$location","Auth",function(a,b,c,d,e){var f=e.getToken();null!==f&&d.path("/reports"),c.login=function(){c.loginError=!1;var b=new a(c.email,c.password);b.auth().then(function(){d.path("/reports")},function(a){(400==a.status||401==a.status)&&(c.loginError=!0)})}}]),angular.module("zupPainelApp").controller("GroupsCtrl",["$scope","$modal","Groups",function(a,b,c){a.loading=!0;var d={},e=c.getAll(function(b){a.groups=b.groups,a.loading=!1});a.search=function(b){""===b?delete d.name:d.name=b,a.loadingContent=!0,e=c.getAll(d,function(b){a.groups=b.groups,a.loadingContent=!1})},a.deleteGroup=function(d){b.open({templateUrl:"removeGroup.html",windowClass:"removeModal",resolve:{groupsList:function(){return a.groups}},controller:["$scope","$modalInstance","groupsList",function(a,b,e){a.group=d,a.confirm=function(){var d=c.get({id:a.group.id},function(){d.$delete({id:a.group.id},function(){b.close(),e.splice(e.indexOf(a.group),1)})})},a.close=function(){b.close()}}]})}}]).controller("ViewGroupsCtrl",["$scope","Groups","$routeParams",function(a,b,c){a.loading=!0,b.getUsers({id:c.id},function(b){a.group=b.group,a.users=b.users,a.loading=!1})}]),angular.module("zupPainelApp").controller("UsersCtrl",["$scope","$q","$routeParams","$modal","Users","Groups",function(a,b,c,d,e,f){var g={},h=c.groupId;"undefined"!=typeof h&&(g={groups:h},a.groupId=h),a.loading=!0;var i=e.getAll(g,function(b){a.users=b.users}),j=f.getAll(function(b){a.groups=b.groups});b.all([i.$promise,j.$promise]).then(function(){a.loading=!1}),a.search=function(b){""===b?delete g.name:g.name=b,a.loadingContent=!0,i=e.getAll(g,function(b){a.users=b.users,a.loadingContent=!1})},a.deleteUser=function(b){d.open({templateUrl:"removeUser.html",windowClass:"removeModal",resolve:{usersList:function(){return a.users}},controller:["$scope","$modalInstance","Users","usersList",function(a,c,d,e){a.user=b,a.confirm=function(){var b=d.get({id:a.user.id},function(){b.$delete({id:a.user.id},function(){c.close(),e.splice(e.indexOf(a.user),1)})})},a.close=function(){c.close()}}]})}}]).controller("ViewUsersCtrl",["$scope","Users","$routeParams",function(a,b,c){a.loading=!0,b.get({id:c.id},function(b){a.user=b.user,a.loading=!1})}]),angular.module("zupPainelApp").controller("ReportsCtrl",["$scope","$modal","Reports",function(a,b,c){a.loading=!0,c.get(function(b){a.categories=b.categories,a.loading=!1}),a.deleteCategory=function(d){b.open({templateUrl:"removeCategory.html",windowClass:"removeModal",resolve:{reportsCategoriesList:function(){return a.categories}},controller:["$scope","$modalInstance","Users","reportsCategoriesList",function(a,b,e,f){a.category=d,a.confirm=function(){c.delete({id:a.category.id},function(){b.close(),f.splice(f.indexOf(a.category),1)})},a.close=function(){b.close()}}]})}}]).controller("ViewItemsReportsCtrl",["$scope","Reports","$routeParams",function(a,b,c){a.loading=!0,b.getItemsByCategory({categoryId:c.categoryId},function(b){a.reports=b.reports,a.loading=!1})}]).controller("ViewReportsCtrl",["$scope","Reports","$routeParams",function(a,b,c){a.loading=!0,b.getItem({id:c.id},function(b){a.report=b.report,a.loading=!1})}]),angular.module("zupPainelApp").controller("InventoriesCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").controller("ItemsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("zupPainelApp").directive("bootstrapSwitch",function(){return{link:function(a,b){b.bootstrapSwitch()}}}),angular.module("zupPainelApp").directive("mapItems",function(){return{restrict:"A",link:function(a,b){var c=[{},{featureType:"poi.business",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.government",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.medical",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.school",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.sports_complex",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels",stylers:[{visibility:"off"},{saturation:-100},{lightness:42}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{saturation:-100},{lightness:47}]},{featureType:"landscape",stylers:[{lightness:82},{saturation:-100}]},{featureType:"water",stylers:[{hue:"#00b2ff"},{saturation:-21},{lightness:-4}]},{featureType:"poi",stylers:[{lightness:19},{weight:.1},{saturation:-22}]},{elementType:"geometry.fill",stylers:[{visibility:"on"},{lightness:18}]},{elementType:"labels.text",stylers:[{saturation:-100},{lightness:28}]},{featureType:"poi.attraction",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{saturation:12},{lightness:25}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text",stylers:[{lightness:30}]},{featureType:"landscape.man_made",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{saturation:-100},{lightness:56}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{lightness:62}]},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{visibility:"off"}]}],d=new google.maps.StyledMapType(c,{name:"zup"}),e=new google.maps.LatLng(-23.549671,-46.6321713),f={center:e,zoom:17,disableDefaultUI:!0,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,"zup"]}},g=new google.maps.Map(b[0],f);g.mapTypes.set("zup",d),g.setMapTypeId("zup");for(var h=[[],[],[],[],[]],i=["images/4fd8c824.map_pin_boca-lobo.png","images/3bb7468f.map_pin_entulho.png","images/0ee61379.ponto_bocalobo.png","images/98cfce97.ponto_floresta-urbana.png","images/455bb34c.ponto_praca-wifi.png"],j=[[[-23.549671,-46.6321713]],[[-23.549297,-46.633701]],[[-23.552349,-46.632923],[-23.551926,-46.632601],[-23.55113,-46.632376],[-23.549861,-46.632065],[-23.54931,-46.632043],[-23.548307,-46.632494]],[[-23.549822,-46.631056],[-23.549654,-46.630638],[-23.550087,-46.630852],[-23.549969,-46.630509],[-23.549841,-46.630273],[-23.54929,-46.629908],[-23.549576,-46.629544]],[[-23.550878,-46.631134]]],k=[[['<h1>Coleta de entulho</h1><p>Enviada ontem</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>']],[['<h1>Coleta de entulho</h1><p>Enviada hoje</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>']],[['<h1>Coleta de entulho</h1><p>Enviada hoje</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 3 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 5 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 4 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 6 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 2 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>']],[['<h1>Coleta de entulho</h1><p>Enviada hoje</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada ontem</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 2 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 3 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 4 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>'],['<h1>Coleta de entulho</h1><p>Enviada há 5 dias</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>']],[['<h1>Coleta de entulho</h1><p>Enviada há 1 semana</p><a href="#/items/1" data-toggle="modal" data-target="#item_pin1">Ver detalhes</a>']]],l=j[0].length-1;l>=0;l--){var m=new google.maps.LatLng(j[0][l][0],j[0][l][1]),n=new google.maps.Marker({position:m,map:g,icon:i[0],animation:google.maps.Animation.DROP});h[0].push(n);var o=new google.maps.InfoWindow,p=l;google.maps.event.addListener(n,"click",function(){console.log(p),o.setContent('<div class="pinTooltip">'+k[0][p]+"</div>"),o.open(g,this)})}for(var l=j[1].length-1;l>=0;l--){var m=new google.maps.LatLng(j[1][l][0],j[1][l][1]),n=new google.maps.Marker({position:m,map:g,icon:i[1],animation:google.maps.Animation.DROP});h[1].push(n);var o=new google.maps.InfoWindow,p=l;google.maps.event.addListener(n,"click",function(){o.setContent('<div class="pinTooltip">'+k[1][p]+"</div>"),o.open(g,this)})}for(var l=j[2].length-1;l>=0;l--){var m=new google.maps.LatLng(j[2][l][0],j[2][l][1]),n=new google.maps.Marker({position:m,map:g,icon:i[2],animation:google.maps.Animation.DROP});h[2].push(n);var o=new google.maps.InfoWindow,p=l;google.maps.event.addListener(n,"click",function(){o.setContent('<div class="pinTooltip">'+k[2][p]+"</div>"),o.open(g,this)})}for(var l=j[3].length-1;l>=0;l--){var m=new google.maps.LatLng(j[3][l][0],j[3][l][1]),n=new google.maps.Marker({position:m,map:g,icon:i[3],animation:google.maps.Animation.DROP});h[3].push(n);var o=new google.maps.InfoWindow,p=l;google.maps.event.addListener(n,"click",function(){o.setContent('<div class="pinTooltip">'+k[3][p]+"</div>"),o.open(g,this)})}for(var l=j[4].length-1;l>=0;l--){var m=new google.maps.LatLng(j[4][l][0],j[4][l][1]),n=new google.maps.Marker({position:m,map:g,icon:i[4],animation:google.maps.Animation.DROP});h[4].push(n);var o=new google.maps.InfoWindow,p=l;google.maps.event.addListener(n,"click",function(){o.setContent('<div class="pinTooltip">'+k[4][p]+"</div>"),o.open(g,this)})}}}}),angular.module("zupPainelApp").controller("TagsCtrl",["$scope","$modal",function(a,b){a.open=function(){b.open({templateUrl:"addTag.html",windowClass:"tagModal",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close()}}]})}}]),angular.module("zupPainelApp").service("User",["$q","$http","Auth",function(a,b,c){return function(d,e){this.auth=function(){var f=a.defer(),g=b({method:"POST",url:"{base_url}/authenticate.json",data:{email:d,password:e},expectedErrors:[400,401]});return g.success(function(a){c.saveUser(a.user),c.saveToken(a.token),f.resolve()}),g.error(function(a,b,c,d){f.reject({data:a,status:b,config:d})}),f.promise}}}]),angular.module("zupPainelApp").factory("Auth",["$q","$http","$cookies","$rootScope",function(a,b,c,d){var e=null;return{check:function(){var c=a.defer(),d=this.getToken();if(null!==d&&null===e){var f=b({method:"GET",url:"{base_url}/me.json",headers:{"X-App-Token":d}}),g=this;f.success(function(a){g.saveUser(a.user),c.resolve()}),f.error(function(){c.reject(),g.clearToken()})}else null!==d&&null!==e?c.resolve():(c.reject(),this.clearToken());return c.promise},getToken:function(){var a=c.token;return"undefined"==typeof a?null:a},saveToken:function(a){c.token=a},clearToken:function(){delete c.token},saveUser:function(a){e=a,d.me=e},isLogged:function(){return null!==e&&null!==this.getToken()}}}]),angular.module("zupPainelApp").factory("Error",["$modal",function(a){return{showDetails:function(b){a.open({templateUrl:"views/modal_error.html",resolve:{response:function(){return b}},controller:["$scope","$modalInstance","response",function(a,b,c){a.response=c,a.ok=function(){window.location.reload()}}]})}}}]),angular.module("zupPainelApp").factory("Groups",["$resource",function(a){return a("{base_url}/groups/:id.json",{id:"@id"},{update:{method:"PUT"},getAll:{method:"GET"},getUsers:{url:"{base_url}/groups/:id/users.json",method:"GET",params:{id:"@id"}}})}]),angular.module("zupPainelApp").factory("Users",["$resource",function(a){return a("{base_url}/users/:id.json",{id:"@id"},{update:{method:"PUT"},getAll:{method:"GET"}})}]),angular.module("zupPainelApp").directive("hackSidebarHeight",function(){return{link:function(a,b){a.$watch(function(){return angular.element(document).height()},function(a){b.height(a)})}}}),angular.module("zupPainelApp").factory("Reports",["$resource",function(a){return a("{base_url}/reports/categories/:id.json",{id:"@id"},{getItemsByCategory:{url:"{base_url}/reports/:categoryId/items.json",method:"GET",params:{categoryId:"@categoryId"}},getItem:{url:"{base_url}/reports/items/:id.json",params:{id:"@id"}}})}]),angular.module("zupPainelApp").directive("keyboardPoster",["$parse","$timeout",function(a,b){var c=700;return function(d,e,f){var g=angular.element(e)[0],h=null;g.onkeydown=function(){var g=a(f.keyboardPoster),i=g(d);h&&b.cancel(h),h=b(function(){i(e.val())},c)}}}]);