angular.module('todoApp', [])
    .controller('insertDataController', function ($scope, $http, $timeout) {
        var todoList = this;


        $http.get("kinds.json").success(function (data) {
            $scope.kindsData = data.types;
            $scope.kindsDataModel = $scope.kindsData[0].name;
        });
        $scope.updateData = "no";
        $scope.updateDataId = 0;
        $scope.subBtnText = "Submit";
        $scope.getResult = function(period){
            getBudgetData(period);
        }

        $scope.insertData = function () {
            var method = 'POST';
            var param = "";

            if($scope.updateDataId != 0){
                var rowID = $scope.updateDataId;
                param = "/"+rowID;
                method = 'PUT';
            }
            if(isNaN($scope.budgetRow.price)){
                $scope.msg = "Please enter number";
                return false;
            }
            $scope.budgetRow["date"] = new Date($("#itemDate").val());
            $scope.budgetRow["type"] = $scope.kindsDataModel;
            $scope.budgetRow["name"] = $scope.name;

            $http({
                method  : method,
                url     : '/blobs'+param,
                data    : $.param($scope.budgetRow),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                    console.log(data);

                        $scope.budgetRow = {};
                        getBudgetData();
                        var flag;
                        if($scope.updateData){
                            flag = "Updated";
                        }else{
                            flag = "Added";
                        }
                        $scope.updateData = false;
                        $scope.subBtnText = "Submit";

                        // Temporary fix
                        $scope.budgetRow = {};
                        $scope.msg = flag+" succesfully";
                        timeOut(3000);
                        // if successful, bind success message to message
                        console.log("err");

                });
        }
        var timeOut = function(time){
            if(time === undefined){
                time= 3000;
            }
            var countUp = function() {
                $scope.msg ="";
                $scope.msgData = "";
            }
            $timeout(countUp, time);
        }
        var getTotal = function(result){
            var total = 0;
            for(var i = 0; i < result.length; i++){
                var item = result[i];
                total += (+item.price);
            }
            return total;
        }
        var getBudgetData = function (flag){
            var param = "";

            if(flag != undefined){
                if(flag == "w" || flag == "m" || flag == "y" || flag == "t"){
                    param = "?p="+flag;

                }else if($scope.updateData = "yes"){

                    param = "/"+flag;
                }

            }else{
                param = "";
            }
           // alert(param);
            $http({
                method  : 'GET',
                url     : '/blobs'+param,
                data : $.param({id:param})
            }).success(function(data) {
                console.log(flag);
                console.log(data);
                if($scope.updateData != "yes"){
                    $scope.getTotal = getTotal(data);
                    $scope.resultData = data;
                }else{
                     $scope.budgetRow = data
                    $scope.name = data.name;
                     $scope.kindsDataModel = data.type;
                }

            });
        }

        getBudgetData();

        $scope.deleteRow = function(id){
            if(!confirm("Are you sure?")){
                return false;
            }
            $http({
                method  : 'DELETE',
                url     : '/blobs/'+id,
                data    : $.param({"delete":true, "id": id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                timeOut(10000);

                    getBudgetData();

                    $scope.msgData = "Deleted succesfully";
                    // if successful, bind success message to message
                    console.log("err");
            });
        }
        $scope.updateRow = function(id){
            $scope.updateData = "yes";
            $scope.updateDataId = id;
            $scope.subBtnText = "Update";
            getBudgetData(id);
        }

    });



