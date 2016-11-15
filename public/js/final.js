/*!myNodeApp 2016-11-07 
*/var app = angular.module('todoApp', ["ngRoute", "chart.js"]);
app.config(function($routeProvider){
        $routeProvider
       
        .when("/reports",
        {
            templateUrl: "./reports.html"            
        });
    });
    app.config(['ChartJsProvider', function (ChartJsProvider) {
    'use strict';
    
    ChartJsProvider.setOptions({
         colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'], 
      tooltips: { enabled: false }
    })
 }]);

  app.service("budgetService", function($http){
        
        this.getData = function(callback){
                 $http.get("kinds.json").then(function(data){
                return callback(data);
                });
        }
        this.sendData = function(method, id, budgetRow, callback){
             $http({
                method  : method,
                url     : '/blobs'+id,
                data    : $.param(budgetRow),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function(data){
                return callback(data);
            });
        }
        this.getBudgetData = function(param, callback){
            $http({
                method  : 'GET',
                url     : '/blobs'+param,
                data : param
            }).then(function(data){
         console.log(data)
                return callback(data);
            });
        }
        this.deleteRow = function(id, callback){
            $http({
                method  : 'DELETE',
                url     : '/blobs/'+id,                
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function(data) {
                return callback(data);
            });
        }
                //return types;       
    });

app.controller('insertDataController', function($scope, $http, $timeout, budgetService, $filter) {
    var todoList = this;
    $scope.budgetRow = {date: ''};
    console.log("okkkk")
        // var n = new budgetFactory();
    budgetService.getData(function(data) {
        $scope.kindsData = data.data.types;
        $scope.kindsDataModel = $scope.kindsData[0].name;
    });
    $scope.updateData = "no";
    $scope.updateDataId = 0;
    $scope.subBtnText = "Submit";
    $scope.getResult = function(period) {
        getBudgetData(period);
    }
/*  $scope.$watch("budgetRow.date", function(o, n){
  //    if(o != n)
  console.log(n);
//$scope.$digest();            
//console.log($scope.budgetRow);
        })*/
    $scope.insertData = function() {
      

        if ($scope.updateData == "yes") {
            update = false;
            $scope.budgetRow["update"] = "yes";
        }
        if (isNaN($scope.budgetRow.price)) {
            $scope.msg = "Please enter number";
            return false;
        }
        var method = "POST";
        var id = "";
        if ($scope.budgetRow._id) {
            method = "PUT";
            id = "/" + $scope.budgetRow._id;
        }
        console.log($scope.budgetRow);
        console.log("------------");
       //
       
       
       
       
       
       
       $scope.budgetRow["date"] = $("#itemDate").val();
        $scope.budgetRow["type"] = $scope.kindsDataModel;
        $scope.budgetRow["name"] = $scope.name;
        budgetService.sendData(method, id, $scope.budgetRow, function(data) {
            console.log(data);
            console.log("okkkk");
            $scope.budgetRow = {};
            getBudgetData();
            var flag;
            if ($scope.updateData) {
                flag = "Updated";
            }
            else {
                flag = "Added";
            }
            $scope.updateData = false;
            $scope.subBtnText = "Submit";
            // Temporary fix
            $scope.budgetRow = {};
            $scope.msg = flag + " succesfully";
            timeOut(3000);
            // if successful, bind success message to message
            console.log("err");

        });


    }
    var timeOut = function(time) {
        if (time === undefined) {
            time = 3000;
        }
        var countUp = function() {
            $scope.msg = "";
            $scope.msgData = "";
        }
        $timeout(countUp, time);
    }
    var getTotal = function(result) {
        var total = 0;
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            total += (+item.price);
        }
        return total;
    }
    var getBudgetData = function(flag) {
        var param = "";

        var update = false;

        if (flag != undefined) {
            if (flag == "w" || flag == "m" || flag == "y" || flag == "t") {
                param = "?p=" + flag;
            }
            else {
                param = "/" + flag;
                update = true;
            }

        }
        else {
            param = "";
        }
        
  $scope.series = ['Series A', 'Series B'];
  $scope.onHover = function (points) {
      if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      }
    };
   
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };
        budgetService.getBudgetData(param, function(data) {
            console.log(flag);
            console.log(data);
            var result = data.data;
            if (!update) {
                $scope.getTotal = getTotal(result);
                $scope.resultData = result;
                var y = [];
                var x = []; 
                angular.forEach(result, function(val, key){
                    y.push(val.price);
                    x.push($filter("date")(val.date));
                });
                $scope.data = [y];
                $scope.labels = x;
            }
            else {
                console.log(data);
                $scope.budgetRow = result;
                $scope.name = result.name;
                $scope.kindsDataModel = result.type;
            }

        });
    }

    getBudgetData();

    $scope.deleteRow = function(id) {
        if (!confirm("Are you sure?")) {
            return false;
        }
        budgetService.deleteRow(id, function(data) {
            getBudgetData();
            $scope.msgData = "Deleted succesfully";
        });
    }
    $scope.updateRow = function(id) {
        $scope.updateData = "yes";
        $scope.updateDataId = id;
        $scope.subBtnText = "Update";
        getBudgetData(id);
    }

});
