var app = angular.module('todoApp', ["ngRoute"]);
app.config(function($routeProvider){
        $routeProvider
       
        .when("/reports",
        {
            templateUrl: "./reports.html"            
        });
    });